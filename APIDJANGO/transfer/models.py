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
    
    

    TypeTransfer = models.IntegerChoices("type_transfer", "Lazer Alimentação Saude Contas Transporte Outros")
    type_transfer = models.IntegerField(choices=TypeTransfer.choices, default=TypeTransfer.Outros)
    date = models.DateField(default=timezone.now)
    
    PaymentMethod = models.IntegerChoices("payment_method", "Credito Débito Dinheiro Pix")
    payment_method = models.IntegerField(choices=PaymentMethod.choices, default=PaymentMethod.Dinheiro)

    card_id = models.ForeignKey(CardModel, on_delete=models.CASCADE, blank=True, null=True, related_name='transfers')

    def __str__(self):
        return f"{self.user_id.username} - {self.value} - {self.get_type_transfer_display()} - {self.date}"