import secrets
import string
from django.forms import model_to_dict
from ninja import Router
from verification.models import VerificationCode
from django.utils import timezone
from datetime import timedelta
from user.models import UserModel
import smtplib
import email.message
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from decouple import config
from bcrypt import gensalt, checkpw

from user.schemas import MessageSchema
from verification.schema import CodeSchema, GetCodeSchema, PasswordSchema

router = Router(auth=None)

MAX_ATTEMPTS = 5


def generete_code(max_length=6):
    aplphabet = string.ascii_letters + string.digits
    code = "".join(secrets.choice(aplphabet) for i in range(max_length))
    return code


def send_mail(email, code):
    corpo_email = f"""
    <p>Uerik,</p>

    <p>Insira este código no aplicativo <strong>MoneyTrack</strong><br>
    para redefinir sua senha.</p>

    <h2 style="color:#3b006a; font-size:32px; text-align:center; margin:20px 0;">{code}</h2>

    <p>Este código único expira em 30 minutos.</p>

    <p>Se você não fez esta solicitação, nenhuma ação é necessária.</p>

    <p>Atenciosamente,<br>
    A equipe de Segurança do <strong>MoneyTrack</strong></p>
    """

    msg = MIMEMultipart()
    msg["From"] = config("EMAIL")
    msg["To"] = email
    msg["Subject"] = "Recuperar Senha"
    msg.attach(MIMEText(corpo_email, "html"))

    s = smtplib.SMTP("smtp.gmail.com: 587")
    s.starttls()
    s.login(msg["From"], config("EMAIL_PASSWORD"))
    s.sendmail(msg["From"], [msg["To"]], msg.as_string())
    s.quit()


@router.post("/", response={200: MessageSchema, 400: MessageSchema})
def get_code(request, email: GetCodeSchema):
    try:
        d_email = email.dict()
        user = UserModel.objects.get(email=d_email["email"])
        """
            Verifica se tem codigos anteriores, e se tiver deleta
        """
        VerificationCode.objects.filter(user=user).delete()
        d_user = model_to_dict(user)
        code = generete_code()
        salt = gensalt(rounds=8)
        bcode = code.encode("utf-8")

        code_hash = VerificationCode.hash_code(bcode, salt)
        experired_at = timezone.now() + timedelta(minutes=30)
        new_code = VerificationCode.objects.create(
            user=user, code_hash=code_hash, experired_at=experired_at
        )
        send_mail(user.email, code)
        return 200, {"message": "Email enviado com sucesso!"}
    except Exception as ex:
        return 400, {"message": f"Erro ao enviar o email {ex}"}


@router.post(
    "/verify/", response={200: MessageSchema, 400: MessageSchema, 404: MessageSchema}
)
def verify_code(request, code: CodeSchema):
    try:
        d_code = code.dict()
        user = UserModel.objects.get(email=d_code["email"])
        stored_code = (
            VerificationCode.objects.filter(user=user, used=False)
            .order_by("-created_at")
            .first()
        )
        if not stored_code:
            return 404, {"message": "Codigo nao encontrado ou invalido!"}
        d_stored_code = model_to_dict(stored_code)
        print(d_stored_code)
        bcode = d_code["code"].encode("utf-8")
        bstored_code = stored_code.code_hash.encode("utf-8")
        if stored_code.attempts >= MAX_ATTEMPTS:
            stored_code.delete()
            return 400, {"message": "Limite de tentativas excedido!"}
        if not checkpw(bcode, bstored_code):
            stored_code.attempts += 1
            stored_code.save(update_fields=["attempts"])
            return 400, {"message": "Codigo Invalido!"}

        stored_code.used = True
        stored_code.save()
        return 200, {"message": "Codigo verificado com sucesso!"}
    except Exception as ex:
        return 400, {"message": f"Erro ao verificar o codigo {ex}"}


@router.post(
    "/password/",
    response={200: MessageSchema, 404: MessageSchema, 500: MessageSchema},
)
def changePassword(request, password: PasswordSchema):
    try:
        d_password = password.dict()
        user = UserModel.objects.get(email=d_password["email"])
        user.password = d_password["password"]
        user.encrypassword()
        user.save()
        user.refresh_from_db()
        return 200, {"message": "Senha alterada com sucesso!"}
    except UserModel.DoesNotExist:
        return 404, {"message": "Usuario nao encontrado!"}
    except Exception as ex:
        return 500, {"message": f"Erro ao alterar senha: {ex}"}
