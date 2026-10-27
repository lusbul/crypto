"""Навчальна реалізація трироторної Енігми I/M3, відбивач B.
Порядок роторів, старт і кільця задаються зліва направо.
Історичні параметри: https://enigmamuseum.com/rotwirg.htm
"""
ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
ROTORS = {
    "I": ("EKMFLGDQVZNTOWYHXUSPAIBRCJ", "Q"),
    "II": ("AJDKSIRUXBLHWTMCQGZNPYFVOE", "E"),
    "III": ("BDFHJLCPRTXVZNYEIWGAKMUSQO", "V"),
    "IV": ("ESOVPZJAYQUIRHXLNFTGKDCMWB", "J"),
    "V": ("VZBRGITYUPSDNHLXAWMJQOFECK", "Z"),
}
REFLECTOR = "YRUHQSLDPXNGOKMIEBFZCWVJAT"


def enigma(text, start="AAA", rings="AAA", plugs="",
           order=("I", "II", "III")):
    text = text.upper()
    if any(c not in ABC for c in text):
        raise ValueError("Введіть лише латиницю A–Z без пробілів")
    if (len(start) != 3 or len(rings) != 3
            or any(c not in ABC for c in start + rings)):
        raise ValueError("Старт і кільця: три літери A–Z")
    if len(order) != 3 or len(set(order)) != 3 or any(r not in ROTORS for r in order):
        raise ValueError("Потрібні три різні ротори I–V")
    pairs = plugs.upper().split()
    joined = "".join(pairs)
    if (len(pairs) > 10 or any(len(p) != 2 for p in pairs)
            or any(c not in ABC for c in joined)
            or len(set(joined)) != len(joined)):
        raise ValueError("Перемички: до 10 неперетинних пар, наприклад AB CD")
    panel = dict(zip(ABC, ABC))
    for a, b in pairs:
        panel[a], panel[b] = b, a
    pos = [ABC.index(c) for c in start]
    ring = [ABC.index(c) for c in rings]
    result = ""
    for letter in text:
        middle = ABC[pos[1]] == ROTORS[order[1]][1]
        right = ABC[pos[2]] == ROTORS[order[2]][1]
        if middle:
            pos[0] = (pos[0] + 1) % 26
        if middle or right:
            pos[1] = (pos[1] + 1) % 26
        pos[2] = (pos[2] + 1) % 26
        n = ABC.index(panel[letter])
        for i in (2, 1, 0):
            wiring = ROTORS[order[i]][0]
            offset = pos[i] - ring[i]
            n = (ABC.index(wiring[(n + offset) % 26]) - offset) % 26
        n = ABC.index(REFLECTOR[n])
        for i in (0, 1, 2):
            wiring = ROTORS[order[i]][0]
            offset = pos[i] - ring[i]
            n = (wiring.index(ABC[(n + offset) % 26]) - offset) % 26
        result += panel[ABC[n]]
    return result


message = "HELLOWORLD"
cipher = enigma(message)
print("Шифр:", cipher)
print("Назад:", enigma(cipher))
