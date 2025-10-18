import hashlib
from django.db import models
from user.models import UserModel
from bcrypt import hashpw

# Create your models here.
class VerificationCode(models.Model):
    user = models.ForeignKey(
        UserModel, on_delete=models.CASCADE, related_name="verification_codes"
    )
    code_hash = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    experired_at = models.DateTimeField()
    used = models.BooleanField(default=False)
    attempts = models.IntegerField(default=0)

    class Meta:
        indexes = [
            models.Index(
                fields=["user", "created_at"]
            ),  # cria um indice no banco de dados (melhora a performance)
        ]

    @staticmethod
    def hash_code(plain_code: str, salt: str) -> str:
        return hashpw(plain_code, salt).decode('utf-8')
