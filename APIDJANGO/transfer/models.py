from django.db import models
from user.models import UserModel
from card.models import CardModel
from django.utils import timezone
from pytz import timezone as pytz_timezone
# Create your models here.
class Transfer(models.Model):
    user_id = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='transfers')
    value = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255, blank=True, null=True)
    class TypeTransfer(models.TextChoices):
        LAZER = 'Lazer',
        ALIMENTACAO = 'Alimentação',
        TRANSPORTE = 'Transporte',
        SAUDE = 'Saúde',
        CONTAS = 'Conta',
        OUTROS = 'Outros'

    type_transfer = models.CharField(max_length=50, choices=TypeTransfer.choices, default=TypeTransfer.OUTROS)
    date = models.DateTimeField(default=timezone.now)
    class PaymentMethod(models.TextChoices):
        CREDIT_CARD = 'Cartão de Crédito',
        DEBIT_CARD = 'Cartão de Débito',
        CASH = 'Dinheiro',
        BANK_TRANSFER = 'Transferência Bancária',
        PIX = 'Pix'
    payment_method = models.CharField(max_length=50, choices=PaymentMethod.choices, default=PaymentMethod.CREDIT_CARD)
    card_id = models.ForeignKey(CardModel, on_delete=models.CASCADE, blank=True, null=True, related_name='transfers')

    def __str__(self):
        return f"{self.user_id.username} - {self.value} - {self.type_transfer} - {self.date}"