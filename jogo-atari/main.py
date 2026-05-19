import pygame
import sys
from settings import *
from sprites import Player, Asteroid, Bullet

# Inicialização do Pygame
pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Atari Space Shooter")
clock = pygame.time.Clock()

# Tenta carregar uma fonte nativa do sistema
font_name = pygame.font.match_font('arial')

def draw_text(surf, text, size, x, y):
    """Função auxiliar para desenhar textos na tela."""
    font = pygame.font.Font(font_name, size)
    text_surface = font.render(text, True, WHITE)
    text_rect = text_surface.get_rect()
    text_rect.midtop = (x, y)
    surf.blit(text_surface, text_rect)

def show_game_over_screen(score):
    """Exibe a tela de Game Over e aguarda o jogador recomeçar."""
    screen.fill(BLACK)
    draw_text(screen, "GAME OVER", 64, WIDTH / 2, HEIGHT / 4)
    draw_text(screen, f"Sua pontuação: {score}", 30, WIDTH / 2, HEIGHT / 2 - 30)
    draw_text(screen, "Pressione qualquer tecla para recomeçar", 22, WIDTH / 2, HEIGHT / 2 + 50)
    pygame.display.flip()
    
    waiting = True
    while waiting:
        clock.tick(FPS)
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            # Começa o jogo ao soltar alguma tecla
            if event.type == pygame.KEYUP:
                waiting = False

# Variáveis do Loop de Jogo
game_over = False
score = 0
frame_count = 0

all_sprites = pygame.sprite.Group()
asteroids = pygame.sprite.Group()
bullets = pygame.sprite.Group()

player = Player()
all_sprites.add(player)

running = True
while running:
    # Lida com o reinício do jogo após a tela de Game Over
    if game_over:
        show_game_over_screen(score)
        game_over = False
        
        # Reinicia o estado do jogo
        all_sprites.empty()
        asteroids.empty()
        bullets.empty()
        
        player = Player()
        all_sprites.add(player)
        score = 0
        frame_count = 0

    # Controla a velocidade do loop
    clock.tick(FPS)
    frame_count += 1
    
    # 1. Processamento de Eventos (Inputs)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                bullet = player.shoot()
                all_sprites.add(bullet)
                bullets.add(bullet)

    # Lógica de Spawn de Asteroides (aumenta a dificuldade com a pontuação)
    current_spawn_rate = max(15, ASTEROID_SPAWN_RATE - (score // 50) * 3)
    
    if frame_count % current_spawn_rate == 0:
        a = Asteroid(score)
        all_sprites.add(a)
        asteroids.add(a)

    # 2. Atualização das entidades
    all_sprites.update()

    # Colisão: Projétil x Asteroide (destrói ambos)
    hits = pygame.sprite.groupcollide(asteroids, bullets, True, True)
    for hit in hits:
        score += 10
        # Opcional: Para o jogo ficar mais dinâmico, pode-se instanciar outro asteroide
        # logo após destruir um.
        # a = Asteroid()
        # all_sprites.add(a)
        # asteroids.add(a)

    # Colisão: Jogador x Asteroide (Game Over)
    # O último parâmetro (False) não deleta a nave automaticamente
    hits = pygame.sprite.spritecollide(player, asteroids, False)
    if hits:
        game_over = True
        
    # Condição: Asteroide atinge o fundo da tela (Game Over)
    for a in asteroids:
        if a.rect.bottom >= HEIGHT:
            game_over = True
            break

    # 3. Renderização (Desenho)
    screen.fill(BLACK)
    all_sprites.draw(screen)
    draw_text(screen, f"Score: {score}", 24, 70, 10)

    # Troca o buffer da tela (atualiza o display)
    pygame.display.flip()

pygame.quit()
