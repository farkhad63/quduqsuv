from ast import For, Str
from codecs import BOM_UTF16
from datetime import date
from django.shortcuts import render

# http://127.0.0.1:8000/APIGET?NQ=1&Sathi=101.0&Temp=25.6&PH=8.8&Slnt=0&DT=2016-05-17%2015:40:33
from django.http import HttpResponse

from main.models import Quduglar, korsatgichlari
import telebot

token = '5836696466:AAGS22K-AeXm9mBdQoEEyVxDt2YjKX-iM6k'
chat_id = [99036877,6116657330,58016741]
#1311010029 Lutfiya
#99036877 Farxat
#6116657330 Djumanov
#58016741 Kamola
#166241966 Dilhod Eshmurodov 166241966
#58293454 Begzod 58293454
FIO=['F.F. Rajabov','J.X. Djumanov','K. Abdurashidova']
bot = telebot.TeleBot(token)

def APIGET(request):
    erb= bool(request.GET)
    if erb:
        try:
            NQuduq=int(request.GET["NQ"])
            sath=float(request.GET["Sathi"])
            temp=float(request.GET["Temp"])
            PH=float(request.GET["PH"])
            Sim=float(request.GET["Slnt"])
            timeDate=request.GET["DT"]
            q_id=NQuduq
            content = {
                'titel':'API',
                'sath':sath,
                'temp':temp,
                'PH':PH,
                'Sim':Sim,
                'date':timeDate,
                'erb':erb
            }
            Qudug=Quduglar.objects.all()    
 #           params=korsatgichlari.objects.order_by("-mes_date").filter(quduq_id=q_id)
            params=korsatgichlari(quduq_id=q_id,sath_quduq=sath,tempInC=temp,PH=PH,Sim=Sim,mes_date=timeDate)
            params.save() 
            if Sim==0:
                k=0
                message="Hurmatli " + FIO[k] +", Sizga ma'lum qilamizki, monitoring qilinayotgan quduq suvi Shurlanganligi(TDS):0  ppm ga teng !! Qudugda suv yo'q yoki o'lchagich suv sathidan balanda.  Dear, We inform you that the monitored well water Salinity(TDS): 0 ppm !! There is no water in the well or the meter is above the water level"
                for id in chat_id:
                    bot.send_message(id,message)
                    k=k+1
                message="Axborot sifatida Sizga ma'lum qilamizki, monitoring qilinayotgan quduq suvi Sathi:"+ str(sath) + " sm, Temeraturasi:" + str(temp) +" °C, Ichqorligi(PH):" + str(PH) +' ga teng !! For your information, we inform you that the well water being monitored is Level: ' +str(sath) + ' cm, Temperature:' + str(temp) + ' °C, Alkalinity (PH)' + str(PH)  + ' !!'
                for id in chat_id:
                    bot.send_message(id,message)
                message="Siz https://qudugsuvi.uz/home/"+str(q_id)+"/ saytiga kirib, quduq suvi sifati va sathi o'zgarishi dinamikasini ko'rishingiz mumkin! You can visit https://qudugsuvi.uz/home/"+str(q_id)+"/ and see the dynamics of well water quality and level changes!"
                for id in chat_id:
                    bot.send_message(id,message)
        except ValueError:
            content = {
                'titel':'Xato',
                'sath':0,
                'temp':0,
                'PH':0,
                'Sim':0,
                'date':'000000',
                'erb':False
            }
            pass
#        Qudug=Quduglar.objects.all()    
#        params=korsatgichlari.objects.filter(quduq_id=q_id)
    else:
        content = {
        'titel':'xato API',
        'err':'Xoto API korsatgichlar',
        'erb':erb        
#        'quduq':Qudug[q_id-1],
#        'param':params
        }
    return render(request,'APIGET.html',content)
    
def home(request,q_slug):
    q_id=int(q_slug)
    Qudug=Quduglar.objects.all()    
    params=korsatgichlari.objects.order_by("-mes_date").filter(quduq_id=q_id)
   
    content = {
    'titel':'Dayver malumotlari',
    'quduq':Qudug[q_id-1],
    'param':params
    }
    return render(request,'home.html',content)

def about(request):
    content = {
    'titel':'Haqimizda',
    'Content':"Qisaqcha ma'lumot"
     }
    for id in chat_id:
       bot.send_message(id,'Tekshiruv')
    return render(request,'about.html',content)

def index(request):
    Qudug=Quduglar.objects.all() 
    content = {
    'titel':'Bosh sahifa',
    'qdq':Qudug
     }
    return render(request,'index.html',content)

def develop(request):
    content = {
    'titel':'Bosh sahifa',
    'Content':"Quduqlar joylashuvi"
     }
    return render(request,'develop.html',content)

