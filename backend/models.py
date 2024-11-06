from config import db

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), unique=False, nullable=False)
    expressao = db.Column(db.Integer, unique=False, nullable=False)
    idade = db.Column(db.Integer, unique=False, nullable=False)
    
    def  to_json(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "expressao": self.expressao,
            "idade": self.idade
        }