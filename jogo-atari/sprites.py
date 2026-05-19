import pygame
import random
from settings import *

class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        # Criando a superfície com suporte a transparência
        self.image = pygame.Surface((50, 40), pygame.SRCALPHA)
        # Desenhando um triângulo verde simulando uma nave clássica
        pygame.draw.polygon(self.image, GREEN, [(25, 0), (0, 40), (50, 40)])
        self.rect = self.image.get_rect()
        
        # Posição inicial no centro, parte inferior da tela
        self.rect.centerx = WIDTH // 2
        self.rect.bottom = HEIGHT - 20
        self.speedx = 0

    def update(self):
        self.speedx = 0
        keystate = pygame.key.get_pressed()
        
        # Movimentação
        if keystate[pygame.K_LEFT]:
            self.speedx = -PLAYER_SPEED
        if keystate[pygame.K_RIGHT]:
            self.speedx = PLAYER_SPEED
            
        self.rect.x += self.speedx
        
        # Restrição para não sair da tela
        if self.rect.left < 0:
            self.rect.left = 0
        if self.rect.right > WIDTH:
            self.rect.right = WIDTH

    def shoot(self):
        # Cria um novo projétil no topo e centro da nave
        bullet = Bullet(self.rect.centerx, self.rect.top)
        return bullet

class Asteroid(pygame.sprite.Sprite):
    def __init__(self, score=0):
        super().__init__()
        # Tamanho aleatório para variar o desafio
        size = random.randint(20, 50)
        self.image = pygame.Surface((size, size))
        self.image.fill(RED)
        self.rect = self.image.get_rect()
        
        # Surge em posição X aleatória no topo, fora da tela inicial
        self.rect.x = random.randrange(0, WIDTH - self.rect.width)
        self.rect.y = random.randrange(-100, -40)
        
        # Velocidade aumenta conforme a pontuação
        speed_bonus = score // 50
        self.speedy = random.randrange(ASTEROID_MIN_SPEED, ASTEROID_MAX_SPEED) + speed_bonus

    def update(self):
        self.rect.y += self.speedy

class Bullet(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((4, 15))
        self.image.fill(YELLOW)
        self.rect = self.image.get_rect()
        self.rect.centerx = x
        self.rect.bottom = y
        self.speedy = BULLET_SPEED

    def update(self):
        self.rect.y += self.speedy
        # Remove da memória se sair pelo topo da tela
        if self.rect.bottom < 0:
            self.kill()
