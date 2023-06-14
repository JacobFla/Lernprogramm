import requests
import json

url = "https://irene.informatik.htw-dresden.de:8888/api/quizzes"
username = "jfla42@gmail.com"
password = "supersecretpassword"

headers = {
    "Content-Type": "application/json",
}

dataArray = [
    {"title":"IT", "text":"Welche Authentifizierung bietet HTTP", "options":["OTP","OAuth","2-Faktor-Authentifizierung","Digest Access Authentication"], "answer": [3]},
    {"title":"IT", "text":"Welches Transportprotokoll eignet sich für zeitkritische Übertragungen", "options":["TCP","HTTP","UDP","Fast Retransmit"], "answer": [2]},
    {"title":"IT", "text":"Wofür steht CSS?", "options":["Computer Style Sheets", "Cascading Style Sheets","Computer Supported Styling","Creative Style Sheets"], "answer": [1]},
    {"title":"IT", "text":"Welche Methode wird in HTTP verwendet, um Daten an den Server zu senden?", "options":["POST","GET","PUT","DELETE"], "answer": [0]},
    {"title":"IT", "text":"Welche Programmiersprache wird häufig für die serverseitige Webentwicklung verwendet?", "options":["Python","JavaScript","Java","C#"], "answer": [1]},
    {"title":"IT", "text":"Welche HTTP-Statuscode wird verwendet, um anzuzeigen, dass eine Ressource nicht gefunden wurde?", "options":["200","400","402","404"], "answer": [3]},
    {"title":"IT", "text":"Was ist der Unterschied zwischen HTTP und HTTPS?", "options":["HTTP ist schneller als HTTPS","HTTPS ist schneller als HTTP","HTTP ermöglicht eine sichere Verbindung zu Websites","HTTPS verschlüsselt die Datenübertragung"], "answer": [3]},
    {"title":"IT", "text":"Was ist der Hauptzweck von JSON?", "options":["Datenübertragung und -speicherung","Sortieren von Daten","Website-Styling und -Design","Datenbankabfragen"], "answer": [0]}
]

for i in range(0, len(dataArray)):
    payload = json.dumps(dataArray[i])
    response = requests.post(url, data=payload, headers=headers, auth=(username, password))
    if response.status_code == 200:
        print("Quiz erfolgreich erstellt")
        print(response.text)
    else:
        print("Fehler beim Senden: ", response.status_code)
        print(response.text)
