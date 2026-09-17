"""
Couche de compatibilite navigateur.

Le jeu original lit le clavier avec termios/tty/select (des API Unix qui
n'existent pas dans Pyodide) et ecrit directement sur sys.stdout, qui va
normalement vers un vrai terminal. Ici on remplace ces deux briques par :
  - une file d'attente de touches, remplie par JavaScript (xterm.js) a
    chaque frappe clavier ;
  - un sys.stdout "maison" qui renvoie le texte ecrit par le jeu vers
    JavaScript, qui l'affiche dans le terminal xterm.js.
"""
import sys
from js import zeldaTerminalWrite

_key_buffer = []


def push_key(ch):
    """Appelee depuis JavaScript a chaque touche pressee dans le terminal."""
    _key_buffer.append(ch)


def has_key():
    return len(_key_buffer) > 0


def read_key():
    if _key_buffer:
        return _key_buffer.pop(0)
    return ''


def clear_keys():
    _key_buffer.clear()


class _WebStdout:
    def write(self, s):
        if s:
            zeldaTerminalWrite(s)
        return len(s)

    def flush(self):
        pass


def install():
    sys.stdout = _WebStdout()
    sys.stderr = _WebStdout()
