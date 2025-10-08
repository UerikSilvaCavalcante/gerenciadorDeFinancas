from django.db import models
from user.models import UserModel
# Create your models here.
class CardModel(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE, related_name='cards', default=1)
    bander = models.CharField(max_length=50)
    bank = models.CharField(max_length=50)
    TypeCard = models.IntegerChoices("type_card", "Credito Debito Credito/Debito")
    type_card = models.IntegerField(choices=TypeCard.choices, default=TypeCard.Credito)
    limit = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, null=True, blank=True)
    color = models.CharField(max_length=7, default='#000000', null=True, blank=True)

    def __str__(self):
        return f"{self.bander} - {self.bank} - {self.get_type_card_display()}"