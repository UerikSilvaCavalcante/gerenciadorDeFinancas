from django.db import models
from user.models import UserModel
# Create your models here.
class CardModel(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='cards', default=1)
    brand = models.CharField(max_length=50)
    bank = models.CharField(max_length=50)
    class Type_card(models.TextChoices):
        CREDIT = 'Cartão de Crédito',
        DEBIT = 'Cartão de Débito',
        CREDIT_DEBIT = 'Cartão de Crédito e Débito',    
    type_card = models.CharField(max_length=50, choices=Type_card.choices, default=Type_card.CREDIT)
    limit = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, null=True, blank=True)
    closing_date = models.DateField(null=True, blank=True)
    color = models.CharField(max_length=7, default='#000000', null=True, blank=True)

    def __str__(self):
        return f"{self.brand} - {self.bank} - {self.get_type_card_display()}"