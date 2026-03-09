from api.ai_utils import evaluate_interview_answer

def run_test():
    target_role = "Python Backend Developer"
    question = "Can you explain the difference between a list and a tuple in Python?"

    user_answer = "A list is mutable so you can change it, but a tuple is immutable. Lists use square brackets and tuples use parentheses."

    print("Sending request to Gemini API, Please wait...")

    result = evaluate_interview_answer(
        question_text=question, 
        user_answer=user_answer, 
        target_role=target_role
    )

    print("\n--- AI Evaluation Result ---")
    print(f"Technical Score: {result.get('technical_score')}/10")
    print(f"Communication Score: {result.get('communication_score')}/10")
    print(f"Feedback: {result.get('feedback')}")

if __name__ == "__main__":
    run_test()