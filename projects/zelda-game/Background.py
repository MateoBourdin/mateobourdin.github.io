import sys
import os
import time
#le module background gere le type abstrait de donnee Background 
#un Background contient une chaine de caracteres qui represente 
#une image de fond d ecran

import Player

class Background:
	pass


def create(filename):
	#creation du fond
	sys.stdout.write("\033[2J\033[H")
	bg=Background()
	bg.filename=filename
	#ouverture fichier
	myfile = open(filename, "r")
	bg.str=myfile.read()
	myfile.close()
	bg.map_data = [list(car) for car in bg.str.split("\n")]
	return bg

"""
def get_char_at_pos(bg, pos):
	y,x = pos
	return bg.map_data[y-1][x-1]
"""

def get_char_at_pos(bg, pos):
	y,x = pos	
	return bg.map_data[y-1][x-1]


#accesseurs/mutateurs
def get_filename(bg): return bg.filename
def get_str(bg): return bg.str
def set_str(bg,val): bg.str=str
def get_map_data(bg): return bg.map_data
def set_map_data(bg,val): bg.map_data=val

def show(bg) : 
    
	#os.system("clear")
	
	#goto
	sys.stdout.write("\033[1;1H")
    
	#couleur fond 
	sys.stdout.write("\033[43m")
	
	#affiche
	#txt="\n\n\n"
	#sys.stdout.write(txt)
	
	#couleur fond
	sys.stdout.write("\033[40m")
	
	#couleur white
	sys.stdout.write("\033[36m")
	
	#affiche
	sys.stdout.write(bg.str)

	sys.stdout.write("\n\n")
	

def map_in_color(bg):
	#os.system("clear")
	str_bg=bg.str
	#goto
	sys.stdout.write("\033[1;1H")
	#sys.stdout.write("\n\n\n")
	for i in range(len(str_bg)):
		if str_bg[i]=="#" or str_bg[i]=='Z':
			sys.stdout.write("\033[38;2;102;51;0m")
			sys.stdout.write(str_bg[i])
		elif str_bg[i]=="-":
			sys.stdout.write("\033[38;2;0;102;204m")
			sys.stdout.write(str_bg[i])
		elif str_bg[i]=="~" or str_bg[i]=='D':
			sys.stdout.write("\033[38;2;255;153;51m")
			sys.stdout.write(str_bg[i])
		elif str_bg[i]=="V" or str_bg[i]=="A" or str_bg[i]=="T":
			sys.stdout.write("\033[38;2;192;192;100m")
			sys.stdout.write(str_bg[i])
		elif str_bg[i]=="t" or str_bg[i]=='"':
			sys.stdout.write("\033[38;2;0;102;0m")
			sys.stdout.write(str_bg[i])
		elif str_bg[i]=="S":
			sys.stdout.write("\033[38;2;165;165;165m")
			sys.stdout.write(str_bg[i])
		elif str_bg[i]=="/":
			sys.stdout.write("\033[38;2;122;208;225m")
			sys.stdout.write(str_bg[i])
		elif str_bg[i]=="+":
			sys.stdout.write("\033[38;2;100;0;0m")
			sys.stdout.write(str_bg[i])
		else:
			sys.stdout.write("\033[38;2;128;128;0m")
			sys.stdout.write(str_bg[i])
	sys.stdout.write("\n\n\n")
	#restoration couleur 
	sys.stdout.write("\033[37m")
	sys.stdout.write("\033[40m")



if __name__ == '__main__':
	#test du module
	"""
	bg = create("Map.txt")
	map_in_color(bg)
	time.sleep(5)
	bg2 = create("FirstSceneWithoutLink.txt")
	map_in_color(bg2)
	time.sleep(5)
	show(bg)
	time.sleep(5)
	show(bg2)
	"""
	bg=create('PalacePart2NoBoss.txt')
	print(str(get_map_data(bg)))
	print(get_char_at_pos(bg,(10,10)))