from flask import request, jsonify
from config import app, db
from models import Contact
import os

@app.route("/contacts", methods=["GET"])
def get_contacts():
    contacts = Contact.query.all()
    json_contacts = list(map(lambda x: x.to_json(), contacts))
    return jsonify({"contacts": json_contacts})

@app.route("/create_contact", methods=["POST"])
def create_contact():
    nome = request.json.get("nome")
    expressao = request.json.get("expressao")
    idade = request.json.get("idade")
    
    if not nome or not expressao or not idade:
        return(
            jsonify({"message": "Você deve incluir o seu nome, exoressão e idade!"}),
               400,
        )
    new_contact = Contact(nome=nome, expressao=expressao, idade=idade)
    try:
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}),400
    return jsonify({"message": "Usuário criado!"}), 201

@app.route("/update_contact/<int:user_id>", methods=["PATCH"])
def update_contact(user_id):
    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({"message": "Usuário não encontrado!"}), 404
    data = request.json
    contact.nome = data.get("nome", contact.nome)
    contact.expressao = data.get("expressao", contact.expressao)
    contact.idade = data.get("idade", contact.idade)
    
    db.session.commit()
    
    return jsonify({"message": "Usuário atualizado!"}), 200

@app.route("/delete_contact/<int:user_id>", methods=["DELETE"])
def delete_contact(user_id):
    contact = Contact.query.get(user_id)
    if not contact:
        return jsonify({"message": "Usuário não encontrado!"}), 404
    
    db.session.delete(contact)
    db.session.commit()
    
    return jsonify({"message": "Usuário deletado!"}), 200

@app.route("/calcular_risco", methods=["POST"])
def calcular_risco():
    expressao = request.json.get("expressao")
    idade = request.json.get("idade")
    
    # Validação
    if expressao is None or idade is None:
        return jsonify({"message": "Por favor, forneça valores para expressão e idade."}), 400
    if not (1 <= expressao <= 100):
        return jsonify({"message": "O valor de expressão deve estar entre 1 e 100."}), 400
    if not (18 <= idade <= 80):
        return jsonify({"message": "A idade deve estar entre 18 e 80 anos."}), 400

    # Lógica
    if expressao < 25 and idade < 25:
        classe_risco = 1
        mensagem = "Baixo risco."
    elif 25 <= expressao < 50 and 25 <= idade < 40:
        classe_risco = 2
        mensagem = "Risco moderado."
    elif 50 <= expressao < 75 and 40 <= idade < 60:
        classe_risco = 3
        mensagem = "Alto risco."
    elif expressao >= 75 and idade >= 60:
        classe_risco = 4
        mensagem = "Risco elevado."
    else:
        classe_risco = 2  
        mensagem = "Risco moderado."

    # Retorna a resposta
    return jsonify({
        "classe_risco": classe_risco,
        "mensagem": mensagem
    }), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
