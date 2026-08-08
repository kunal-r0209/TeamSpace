import os
import smtplib
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Load environment variables
load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")


def send_email(receiver_email: str, subject: str, body: str):
    """
    Sends a plain text email.
    """

    try:
        message = MIMEMultipart()

        message["From"] = SMTP_EMAIL
        message["To"] = receiver_email
        message["Subject"] = subject

        message.attach(MIMEText(body, "plain"))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)

        server.sendmail(
            SMTP_EMAIL,
            receiver_email,
            message.as_string()
        )

        server.quit()

        print(f"Email sent successfully to {receiver_email}")

    except Exception as e:
        print("Email Error:", e)
        raise e


def send_otp_email(receiver_email: str, otp: str):
    """
    Sends Password Reset OTP.
    """

    subject = "Password Reset OTP"

    body = f"""
Hello,

Your Password Reset OTP is:

{otp}

This OTP is valid for 10 minutes.

If you did not request this, please ignore this email.

Regards,
Login System
"""

    send_email(
        receiver_email,
        subject,
        body
    )