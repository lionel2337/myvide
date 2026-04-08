# calculs.py - Petit outil mathématique pour le groupe

def addition(a, b):
    """Retourne la somme de deux nombres"""
    return a + b

def soustraction(a, b):
    """Retourne la différence de deux nombres"""
    return a - b

def multiplication(a, b):
    """Retourne le produit de deux nombres"""
    return a * b

def division(a, b):
    """Retourne le quotient de deux nombres"""
    if b == 0:
        return "Erreur : Division par zéro !"
    return a / b

# Message de bienvenue
print("=== Bienvenue dans la calculatrice du groupe ===")
print("Fonctions disponibles : addition, soustraction, multiplication, division")
print()

# Exemple d'utilisation
if __name__ == "__main__":
    x, y = 10, 5
    print(f"Tests avec {x} et {y} :")
    print(f"Addition : {addition(x, y)}")
    print(f"Soustraction : {soustraction(x, y)}")
    print(f"Multiplication : {multiplication(x, y)}")
    print(f"Division : {division(x, y)}")