from django.db import models
from decimal import Decimal
from bcrypt import gensalt, hashpw, checkpw

# Create your models here.
class UserModel(models.Model):
    name = models.CharField(max_length=100)
    username = models.CharField()
    password = models.CharField(max_length=100)
    email = models.EmailField()
    valorGasto = models.DecimalField(default=Decimal(0.00), max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name
    
    def encrypassword(self):
        salt = gensalt(rounds=10)
        bpassword = self.password.encode()
        hashed_pass = hashpw(bpassword, salt)
        hashed_pass = hashed_pass.decode('utf-8')
        self.password = hashed_pass

    def validate_password(self, password):
        bstored_password = self.password.encode('utf-8')
        bpassword = password.encode('utf-8')
        if checkpw(bpassword, bstored_password):
            return True
        else:
            return False