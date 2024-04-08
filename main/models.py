import datetime
from django.db import models


class Quduglar(models.Model):
    qudug_nomi = models.CharField(max_length=200)
    Location = models.CharField(max_length=200)
    def __str__(self):
        return self.qudug_nomi
    class Meta:
        verbose_name = "Quduq"
        verbose_name_plural = "Quduqlar"

class korsatgichlari(models.Model):
    quduq = models.ForeignKey(Quduglar, on_delete=models.CASCADE)
    sath_quduq = models.FloatField(default=20.0)
    tempInC = models.FloatField(default=20.0)
    PH = models.FloatField(default=8.0)
    Sim= models.FloatField(default=0.0)
    mes_date = models.DateTimeField("olingan vaqti")
    def was_published_recently(self):
        return self.mes_date >= datetime.timezone.now() - datetime.timedelta(days=1)
    def __str__(self):
        return "Ko'rsatgichlar"
    class Meta:
        verbose_name = "Ko'rsatgich"
        verbose_name_plural = "Ko'rsatgichlar"
