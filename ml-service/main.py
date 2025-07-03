from fastapi import FastAPI, File, UploadFile
import spacy
import fitz  # PyMuPDF
import requests
import hashlib
import redis
import re

# Initialize Redis and SpaCy
r = redis.Redis(host="localhost", port=6379, decode_responses=True)
app = FastAPI()
nlp = spacy.load("en_core_web_md")


@app.get("/")
def home():
    return {"message": "ML API running"}


@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    import hashlib
    import re

    contents = await file.read()
    file_hash = hashlib.md5(contents).hexdigest()

    if r.exists(file_hash):
        return eval(r.get(file_hash))

    try:
        doc = fitz.open(stream=contents, filetype="pdf")
        text = "\n".join([page.get_text() for page in doc])
        lines = text.splitlines()

        # === Extract Email ===
        email_match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
        email = email_match.group(0) if email_match else "Not found"

        # === Extract Name === (first valid non-heading line)
        name = "Not found"
        for line in lines:
            clean = line.strip()
            if (
                clean
                and len(clean.split()) >= 2
                and "email" not in clean.lower()
                and "phone" not in clean.lower()
                and "@" not in clean
                and not re.search(r"\d", clean)
            ):
                name = clean
                break

        # === Extract Skills from 'Skills' or 'Additional Information' section ===
        skills = []
        skills_found = False
        for i, line in enumerate(lines):
            if re.search(r"(skills|additional information)", line, re.IGNORECASE):
                skills_block = []
                for j in range(i + 1, min(i + 8, len(lines))):
                    if any(
                        kw in lines[j].lower()
                        for kw in ["education", "projects", "experience", "certification"]
                    ):
                        break
                    skills_block.append(lines[j])
                flat = " ".join(skills_block)
                skills = [s.strip() for s in re.split(r"[,\n]", flat) if len(s.strip()) > 1]
                skills_found = True
                break

        # === Extract Experience from 'Professional Experience' or 'Experience' section ===
        experience = "Not found"
        experience_found = False
        experience_lines = []

        for i, line in enumerate(lines):
            if re.search(r"(professional experience|experience)", line.strip(), re.IGNORECASE):
                for j in range(i + 1, len(lines)):
                    if re.search(
                        r"(projects|education|skills|certifications|additional information)",
                        lines[j].strip(),
                        re.IGNORECASE,
                    ):
                        break
                    experience_lines.append(lines[j].strip())
                break

        if experience_lines:
            experience = "\n".join(experience_lines).strip()

        result = {
            "name": name,
            "email": email,
            "skills": skills[:10],
            "experience": experience,
        }

        r.set(file_hash, str(result), ex=86400)
        return result

    except Exception as e:
        return {"error": str(e)}

@app.post("/match-resume")
async def match_resume(file: UploadFile = File(...)):
    contents = await file.read()

    try:
        # Extract resume text
        doc = fitz.open(stream=contents, filetype="pdf")
        text = "".join([page.get_text() for page in doc])
        resume_doc = nlp(text)

        # Fetch jobs
        res = requests.get("http://localhost:5001/api/jobs")
        jobs = res.json()

        scored = []
        for job in jobs:
            job_text = f"{job['title']} {job['description']} " \
                       f"{' '.join(job['skills']) if isinstance(job['skills'], list) else job['skills']}"
            job_doc = nlp(job_text)
            similarity = resume_doc.similarity(job_doc)
            scored.append((job, similarity))
        scored = [(job, score) for job, score in scored if score > 0.6]
        top_matches = sorted(scored, key=lambda x: x[1], reverse=True)[:5]

        return {
            "matches": [
                {"job": job, "score": round(score, 2)} for job, score in top_matches
            ]
        }

    except Exception as e:
        return {"error": str(e)}
