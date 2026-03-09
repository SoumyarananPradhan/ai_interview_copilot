import os
import re
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()
client = genai.Client()

def evaluate_interview_answer(question_text, user_answer, target_role):
    prompt = f"""
    You are an expert technical interviewer and helpful mentor evaluating a candidate for a {target_role} position.
    Question asked: "{question_text}"
    Candidate's answer: "{user_answer}"
    Evaluate the candidate's answer. Return ONLY a valid JSON object with the following exact keys:
    - "technical_score": An integer from 1 to 10.
    - "communication_score": An integer from 1 to 10.
    - "feedback": A constructive paragraph explaining what they did well and how to improve. YOU MUST INCLUDE a formatted markdown code block showing the optimal code solution or an example to help them learn.
    """
    try:
        response = client.models.generate_content(model='gemini-2.5-flash', contents=prompt)
        match = re.search(r'\{.*\}', response.text, re.DOTALL)
        if match:
            return json.loads(match.group(0), strict=False)
        return json.loads(response.text, strict=False)
    except Exception as e:
        print(f"Evaluation Error: {e}")
        return {"technical_score": 0, "communication_score": 0, "feedback": "Error generating evaluation."}

def generate_interview_question(target_role, difficulty, previous_questions=None):
    if previous_questions is None:
        previous_questions = []
    avoid_prompt = ""
    if previous_questions:
        avoid_prompt = "\nCRITICAL RULE: DO NOT ask any of the following questions as the candidate has already answered them:\n" 
        avoid_prompt += "\n".join([f"- {q}" for q in previous_questions])

    prompt = f"""
    You are an expert technical interviewer hiring for a {target_role} position.
    The candidate's experience level is: {difficulty}.
    {avoid_prompt}
    Generate ONE new, highly relevant interview question for this candidate.
    Return ONLY a valid JSON object with the following exact keys:
    - "question_text": The actual interview question.
    - "category": Either "Technical", "Behavioral", or "System Design".
    """
    try:
        response = client.models.generate_content(model='gemini-2.5-flash', contents=prompt)
        match = re.search(r'\{.*\}', response.text, re.DOTALL)
        if match:
            return json.loads(match.group(0), strict=False)
        return json.loads(response.text, strict=False)
    except Exception as e:
        print(f"Question Generation Error: {e}")
        return {"question_text": f"Can you describe a complex problem you solved related to {target_role}?", "category": "Behavioral"}