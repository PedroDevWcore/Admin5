-- --------------------------------------------------------
-- Servidor:                     104.251.209.68
-- Versão do servidor:           10.3.34-MariaDB-0ubuntu0.20.04.1 - Ubuntu 20.04
-- OS do Servidor:               debian-linux-gnu
-- HeidiSQL Versão:              12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para db_SamCast
CREATE DATABASE IF NOT EXISTS `db_SamCast` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `db_SamCast`;

-- Copiando estrutura para tabela db_SamCast.administradores
CREATE TABLE IF NOT EXISTS `administradores` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `usuario` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `nivel_acesso` enum('super_admin','admin','suporte') DEFAULT 'admin',
  `codigo_perfil_acesso` int(10) DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT 1,
  `ultimo_acesso` datetime DEFAULT NULL,
  `data_criacao` datetime DEFAULT current_timestamp(),
  `data_atualizacao` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `criado_por` int(10) DEFAULT NULL,
  `token_reset` varchar(255) DEFAULT NULL,
  `token_reset_expira` datetime DEFAULT NULL,
  PRIMARY KEY (`codigo`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_admin_email` (`email`),
  KEY `idx_admin_ativo` (`ativo`),
  KEY `idx_admin_nivel` (`nivel_acesso`),
  KEY `idx_admin_perfil_acesso` (`codigo_perfil_acesso`),
  KEY `idx_administradores_perfil` (`codigo_perfil_acesso`),
  CONSTRAINT `fk_admin_perfil_acesso` FOREIGN KEY (`codigo_perfil_acesso`) REFERENCES `perfis_acesso` (`codigo`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.administradores: ~2 rows (aproximadamente)
INSERT INTO `administradores` (`codigo`, `nome`, `usuario`, `senha`, `email`, `nivel_acesso`, `codigo_perfil_acesso`, `ativo`, `ultimo_acesso`, `data_criacao`, `data_atualizacao`, `criado_por`, `token_reset`, `token_reset_expira`) VALUES
	(3, 'Administrador', 'admin', '$2b$10$MNrN.ToKiMxY6GSnX4y3decR4LUj9sjRq3Ab0WazT9eLnvm0MF3xC', 'admin@sistema.com', 'super_admin', 4, 1, '2025-07-21 08:38:51', '2025-07-08 19:18:54', '2025-07-21 10:07:31', NULL, NULL, NULL),
	(4, 'pedro', 'felipe', '$2a$10$yqeHX6Oh3bgTE.wBGFKbl.DsKRNSP8EMEkr6hhfN13Oi2WuhbqmlG', 'hasky159@gmail.com', 'suporte', 6, 1, '2025-07-21 08:38:30', '2025-07-21 08:36:30', '2025-07-21 10:07:32', 3, NULL, NULL);

-- Copiando estrutura para tabela db_SamCast.admin_logs
CREATE TABLE IF NOT EXISTS `admin_logs` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `admin_id` int(10) NOT NULL,
  `acao` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tabela_afetada` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registro_id` int(10) DEFAULT NULL,
  `dados_anteriores` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `dados_novos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_admin_id` (`admin_id`),
  KEY `idx_acao` (`acao`),
  KEY `idx_tabela` (`tabela_afetada`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `admin_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `administradores` (`codigo`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela db_SamCast.admin_logs: ~24 rows (aproximadamente)
INSERT INTO `admin_logs` (`id`, `admin_id`, `acao`, `tabela_afetada`, `registro_id`, `dados_anteriores`, `dados_novos`, `ip_address`, `user_agent`, `created_at`) VALUES
	(1, 3, 'login', NULL, NULL, NULL, '{"ip":"::1"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-08 20:06:50'),
	(2, 3, 'login', NULL, NULL, NULL, '{"ip":"::1"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-08 20:37:40'),
	(3, 3, 'login', NULL, NULL, NULL, '{"ip":"::1"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-08 21:11:12'),
	(4, 3, 'login', 'administradores', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-17 21:37:23'),
	(5, 3, 'login', 'administradores', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-17 21:46:33'),
	(6, 3, 'login', 'administradores', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-17 21:54:34'),
	(7, 3, 'create', 'revendas', 4, NULL, '{"nome":"Fidel Nogueira","email":"fidelcnogueira@gmail.com","telefone":"","senha":"fidel123","streamings":1,"espectadores":100,"bitrate":2000,"espaco":1000,"subrevendas":0,"status_detalhado":"ativo","data_expiracao":"","observacoes_admin":"","limite_uploads_diario":100,"espectadores_ilimitado":true,"bitrate_maximo":5000,"dominio_padrao":"","idioma_painel":"pt-br","url_suporte":""}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-17 21:56:20'),
	(8, 3, 'suspend', 'revendas', 4, NULL, '{"status_detalhado":"suspenso"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-17 21:57:05'),
	(9, 3, 'login', 'administradores', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-17 22:02:49'),
	(10, 3, 'create', 'revendas', 5, NULL, '{"nome":"Vithor","email":"vithorevaristo@gmail.com","telefone":"","senha":"vithor123","streamings":1,"espectadores":100,"bitrate":2000,"espaco":1000,"subrevendas":0,"status_detalhado":"ativo","data_expiracao":"","observacoes_admin":"","limite_uploads_diario":100,"espectadores_ilimitado":true,"bitrate_maximo":5000,"dominio_padrao":"https://streaming.exemplo.com","idioma_painel":"pt-br","url_suporte":""}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-17 22:06:37'),
	(11, 3, 'login', 'administradores', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-21 07:50:29'),
	(12, 3, 'update', 'wowza_servers', 1, '{"codigo":1,"nome":"Servidor Principal","ip":"127.0.0.1","senha_root":"senha_exemplo","porta_ssh":22,"caminho_home":"/home","limite_streamings":200,"grafico_trafego":1,"servidor_principal_id":null,"tipo_servidor":"principal","dominio":"streaming.exemplo.com","streamings_ativas":0,"load_cpu":0,"trafego_rede_atual":"0.00","trafego_mes":"0.00","status":"ativo","data_criacao":"2025-07-21T11:18:17.000Z","data_atualizacao":"2025-07-21T11:18:17.000Z","ultima_sincronizacao":null}', '{"nome":"Servidor Principal","ip":"51.222.156.223","senha_root":"FK38Ca2SuE6jvJXed97VMn","porta_ssh":6985,"caminho_home":"/home","limite_streamings":200,"grafico_trafego":1,"servidor_principal_id":null,"tipo_servidor":"unico","dominio":"stmv1.udicast.com"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-21 08:32:12'),
	(13, 3, 'sync', 'wowza_servers', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-21 08:32:38'),
	(14, 3, 'sync', 'wowza_servers', 1, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-21 08:32:39'),
	(15, 3, 'update', 'perfis_acesso', 4, '{"codigo":4,"nome":"Administrador Completo","descricao":"Acesso total ao sistema exceto gerenciamento de perfis","permissoes":"{\\"dashboard\\":{\\"visualizar\\":true},\\"revendas\\":{\\"visualizar\\":true,\\"criar\\":true,\\"editar\\":true,\\"excluir\\":true,\\"suspender\\":true,\\"ativar\\":true},\\"administradores\\":{\\"visualizar\\":true,\\"criar\\":true,\\"editar\\":true,\\"excluir\\":true,\\"alterar_status\\":true},\\"servidores\\":{\\"visualizar\\":true,\\"criar\\":true,\\"editar\\":true,\\"excluir\\":true,\\"migrar\\":true,\\"sincronizar\\":true,\\"inativar\\":true},\\"perfis\\":{\\"visualizar\\":false,\\"criar\\":false,\\"editar\\":false,\\"excluir\\":false},\\"logs\\":{\\"visualizar\\":true}}","ativo":1,"data_criacao":"2025-07-21T11:17:59.000Z","data_atualizacao":"2025-07-21T11:17:59.000Z","criado_por":3}', '{"nome":"Administrador Completo","descricao":"Acesso total ao sistema exceto gerenciamento de perfis","permissoes":{"dashboard":{"visualizar":true},"revendas":{"visualizar":true,"criar":true,"editar":true,"excluir":true,"suspender":true,"ativar":true},"administradores":{"visualizar":true,"criar":true,"editar":true,"excluir":true,"alterar_status":true},"servidores":{"visualizar":true,"criar":true,"editar":true,"excluir":true,"migrar":true,"sincronizar":true,"inativar":true},"perfis":{"visualizar":true,"criar":true,"editar":true,"excluir":true},"logs":{"visualizar":true}},"ativo":1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-21 08:33:29'),
	(16, 3, 'update', 'perfis_acesso', 6, '{"codigo":6,"nome":"Operador","descricao":"Acesso básico apenas para visualização e operações simples","permissoes":"{\\"dashboard\\":{\\"visualizar\\":true},\\"revendas\\":{\\"visualizar\\":true,\\"criar\\":false,\\"editar\\":false,\\"excluir\\":false,\\"suspender\\":false,\\"ativar\\":false},\\"administradores\\":{\\"visualizar\\":false,\\"criar\\":false,\\"editar\\":false,\\"excluir\\":false,\\"alterar_status\\":false},\\"servidores\\":{\\"visualizar\\":true,\\"criar\\":false,\\"editar\\":false,\\"excluir\\":false,\\"migrar\\":false,\\"sincronizar\\":false,\\"inativar\\":false},\\"perfis\\":{\\"visualizar\\":false,\\"criar\\":false,\\"editar\\":false,\\"excluir\\":false},\\"logs\\":{\\"visualizar\\":false}}","ativo":1,"data_criacao":"2025-07-21T11:17:59.000Z","data_atualizacao":"2025-07-21T11:17:59.000Z","criado_por":3}', '{"nome":"Operador","descricao":"Acesso básico apenas para visualização e operações simples","permissoes":{"dashboard":{"visualizar":true},"revendas":{"visualizar":true,"criar":false,"editar":false,"excluir":false,"suspender":false,"ativar":false},"administradores":{"visualizar":false,"criar":false,"editar":false,"excluir":false,"alterar_status":false},"servidores":{"visualizar":false,"criar":false,"editar":false,"excluir":false,"migrar":false,"sincronizar":false,"inativar":false},"perfis":{"visualizar":false,"criar":false,"editar":false,"excluir":false},"logs":{"visualizar":false}},"ativo":1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-21 08:33:45'),
	(17, 3, 'create', 'administradores', 4, NULL, '{"nome":"pedro","usuario":"felipe","email":"hasky159@gmail.com","nivel_acesso":"admin","ativo":true}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-21 08:36:30'),
	(18, 4, 'login', 'administradores', 4, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-21 08:36:37'),
	(19, 3, 'login', 'administradores', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-21 08:37:34'),
	(20, 3, 'update', 'administradores', 4, '{"codigo":4,"nome":"pedro","usuario":"felipe","senha":"$2a$10$aDetKtuLBt1ELzPx.fIu6Ox4zxJ3myqPLrunVDMazdoOWimbUYofW","email":"hasky159@gmail.com","nivel_acesso":"admin","codigo_perfil_acesso":null,"ativo":1,"ultimo_acesso":"2025-07-21T11:36:37.000Z","data_criacao":"2025-07-21T11:36:30.000Z","data_atualizacao":"2025-07-21T11:36:37.000Z","criado_por":3,"token_reset":null,"token_reset_expira":null}', '{"nome":"pedro","usuario":"felipe","email":"hasky159@gmail.com","senha":"14092002","nivel_acesso":"suporte","ativo":1}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-21 08:37:46'),
	(21, 4, 'login', 'administradores', 4, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-21 08:37:50'),
	(22, 4, 'login', 'administradores', 4, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-21 08:38:30'),
	(23, 3, 'login', 'administradores', 3, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-21 08:38:51'),
	(24, 3, 'update', 'configuracoes', 1, '{"codigo":1,"dominio_padrao":"https://painel.exemplo.com","codigo_wowza_servidor_atual":1,"manutencao":"nao"}', '{"dominio_padrao":"http://samhost.wcore.com.br/","codigo_wowza_servidor_atual":1,"manutencao":"nao"}', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-21 08:39:19');

-- Copiando estrutura para tabela db_SamCast.admin_sessions
CREATE TABLE IF NOT EXISTS `admin_sessions` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `admin_id` int(10) NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `last_activity` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `idx_token` (`token`),
  KEY `idx_admin_id` (`admin_id`),
  KEY `idx_expires_at` (`expires_at`),
  CONSTRAINT `admin_sessions_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `administradores` (`codigo`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela db_SamCast.admin_sessions: ~10 rows (aproximadamente)
INSERT INTO `admin_sessions` (`id`, `admin_id`, `token`, `ip_address`, `user_agent`, `expires_at`, `created_at`, `last_activity`) VALUES
	(4, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjozLCJlbWFpbCI6ImFkbWluQHNpc3RlbWEuY29tIiwiaWF0IjoxNzUyNzc3NDQwLCJleHAiOjE3NTI4NjM4NDB9.XAw3E_lfFZMlMncl3PiMtWTRdF74oOJjw2k0Fm-8vec', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-18 15:37:20', '2025-07-17 21:37:21', '2025-07-17 21:43:55'),
	(5, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjozLCJlbWFpbCI6ImFkbWluQHNpc3RlbWEuY29tIiwiaWF0IjoxNzUyNzc3OTkxLCJleHAiOjE3NTI4NjQzOTF9.UcK1IuQtg0EK_1aYW2pAz_Xrulfs-ZvcMgX-rW6TQ_A', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-18 15:46:31', '2025-07-17 21:46:32', '2025-07-17 21:46:35'),
	(6, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjozLCJlbWFpbCI6ImFkbWluQHNpc3RlbWEuY29tIiwiaWF0IjoxNzUyNzc4NDcyLCJleHAiOjE3NTI4NjQ4NzJ9.Dbk59gccJ9Bdzo-KexuQQpEwkZaH8fuUHvfO0e-bFuI', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-18 15:54:32', '2025-07-17 21:54:33', '2025-07-17 21:57:05'),
	(7, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjozLCJlbWFpbCI6ImFkbWluQHNpc3RlbWEuY29tIiwiaWF0IjoxNzUyNzc4OTY3LCJleHAiOjE3NTI4NjUzNjd9.WRe4nBCDCuioy1Y9YFa747YqCrX0ZCFJHmuXV6BV2nk', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-18 16:02:47', '2025-07-17 22:02:48', '2025-07-17 22:24:59'),
	(8, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjozLCJlbWFpbCI6ImFkbWluQHNpc3RlbWEuY29tIiwiaWF0IjoxNzUzMDczNDI4LCJleHAiOjE3NTMxNTk4Mjh9.S-yOUf2lMYJ8xNbOLEMBYnsng1zmx1a8bNeU8OAgXqc', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-22 01:50:28', '2025-07-21 07:50:29', '2025-07-21 08:36:30'),
	(9, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjo0LCJlbWFpbCI6Imhhc2t5MTU5QGdtYWlsLmNvbSIsImlhdCI6MTc1MzA3NjE5NSwiZXhwIjoxNzUzMTYyNTk1fQ.gfNUoRvYUEyehghMKeFxmkw1HwVb0Q95Uq7bftxHKr4', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-22 02:36:35', '2025-07-21 08:36:37', '2025-07-21 08:37:20'),
	(10, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjozLCJlbWFpbCI6ImFkbWluQHNpc3RlbWEuY29tIiwiaWF0IjoxNzUzMDc2MjUyLCJleHAiOjE3NTMxNjI2NTJ9.DNbV3kKyXD56WpUJ3Ot7xTl9XVEpWBUiPrTSU3oMNlk', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-22 02:37:32', '2025-07-21 08:37:33', '2025-07-21 08:37:47'),
	(11, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjo0LCJlbWFpbCI6Imhhc2t5MTU5QGdtYWlsLmNvbSIsImlhdCI6MTc1MzA3NjI2OSwiZXhwIjoxNzUzMTYyNjY5fQ.znbdQVu0i0aceVYbyqtiOMrT9vI0mBsxvQlg5WUDVVo', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-22 02:37:49', '2025-07-21 08:37:50', '2025-07-21 08:37:50'),
	(12, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjo0LCJlbWFpbCI6Imhhc2t5MTU5QGdtYWlsLmNvbSIsImlhdCI6MTc1MzA3NjMwOCwiZXhwIjoxNzUzMTYyNzA4fQ.ZFpSDJqcYvGP5ZGRO5qAeOLyeUtNNkTPwmUief82wqM', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-22 02:38:28', '2025-07-21 08:38:29', '2025-07-21 08:38:32'),
	(13, 3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjozLCJlbWFpbCI6ImFkbWluQHNpc3RlbWEuY29tIiwiaWF0IjoxNzUzMDc2MzMwLCJleHAiOjE3NTMxNjI3MzB9.gCIYA8ucpo0pSdRtVtf4MImZJDmTZhfei_fJ7Y2GVXg', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36', '2025-07-22 02:38:50', '2025-07-21 08:38:51', '2025-07-21 10:13:53');

-- Copiando estrutura para tabela db_SamCast.Agendamentos
CREATE TABLE IF NOT EXISTS `Agendamentos` (
  `Id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Copiando dados para a tabela db_SamCast.Agendamentos: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela db_SamCast.agendamentos_relay
CREATE TABLE IF NOT EXISTS `agendamentos_relay` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_stm` int(10) NOT NULL,
  `frequencia` int(1) NOT NULL,
  `data_inicio` date NOT NULL,
  `hora_inicio` char(2) NOT NULL,
  `minuto_inicio` char(2) NOT NULL,
  `data_termino` date NOT NULL,
  `hora_termino` char(2) NOT NULL,
  `minuto_termino` char(2) NOT NULL,
  `dias` varchar(50) NOT NULL,
  `url_rtmp` text NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.agendamentos_relay: 0 rows
/*!40000 ALTER TABLE `agendamentos_relay` DISABLE KEYS */;
/*!40000 ALTER TABLE `agendamentos_relay` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.agendamentos_relay_logs
CREATE TABLE IF NOT EXISTS `agendamentos_relay_logs` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_agendamento` int(10) NOT NULL,
  `codigo_stm` int(10) NOT NULL,
  `data` datetime NOT NULL,
  `url_rtmp` varchar(255) NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.agendamentos_relay_logs: 0 rows
/*!40000 ALTER TABLE `agendamentos_relay_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `agendamentos_relay_logs` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.anuncios_videos
CREATE TABLE IF NOT EXISTS `anuncios_videos` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_stm` int(10) NOT NULL,
  `video` text COLLATE latin1_general_ci NOT NULL,
  `tempo` int(10) NOT NULL,
  `data_cadastro` date NOT NULL,
  `exibicoes` int(10) NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Copiando dados para a tabela db_SamCast.anuncios_videos: 0 rows
/*!40000 ALTER TABLE `anuncios_videos` DISABLE KEYS */;
/*!40000 ALTER TABLE `anuncios_videos` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.apps
CREATE TABLE IF NOT EXISTS `apps` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_stm` int(10) NOT NULL,
  `tv_nome` varchar(255) NOT NULL,
  `tv_site` varchar(255) NOT NULL,
  `tv_facebook` varchar(255) NOT NULL,
  `hash` varchar(255) NOT NULL,
  `apk` varchar(255) NOT NULL,
  `zip` varchar(255) NOT NULL,
  `package` varchar(255) NOT NULL,
  `aviso` text NOT NULL,
  `status` int(1) NOT NULL DEFAULT 0,
  `data` datetime NOT NULL,
  `source` varchar(255) NOT NULL DEFAULT 'source1',
  `log_build` longtext NOT NULL,
  `compilado` char(3) DEFAULT 'nao',
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.apps: 0 rows
/*!40000 ALTER TABLE `apps` DISABLE KEYS */;
/*!40000 ALTER TABLE `apps` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.app_multi_plataforma
CREATE TABLE IF NOT EXISTS `app_multi_plataforma` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_stm` int(10) NOT NULL,
  `nome` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `email` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `url_facebook` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `url_instagram` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `url_twitter` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `url_youtube` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `url_site` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `url_chat` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `url_logo` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `url_background` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `whatsapp` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `cor_texto` char(7) COLLATE latin1_general_ci NOT NULL DEFAULT '#FFFFFF',
  `cor_menu_claro` char(7) COLLATE latin1_general_ci NOT NULL DEFAULT '#7386d5',
  `cor_menu_escuro` char(7) COLLATE latin1_general_ci NOT NULL DEFAULT '#6d7fcc',
  `cor_splash` char(7) COLLATE latin1_general_ci NOT NULL DEFAULT '#6d7fcc',
  `text_prog` longtext COLLATE latin1_general_ci NOT NULL,
  `text_hist` longtext COLLATE latin1_general_ci NOT NULL,
  `contador` char(3) COLLATE latin1_general_ci NOT NULL DEFAULT 'nao',
  `tela_inicial` int(1) NOT NULL DEFAULT 1,
  `modelo` int(1) NOT NULL DEFAULT 1,
  `apk_package` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `apk_versao` varchar(255) COLLATE latin1_general_ci NOT NULL DEFAULT '1.0',
  `apk_criado` varchar(255) COLLATE latin1_general_ci NOT NULL DEFAULT 'nao',
  `apk_cert_sha256` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `apk_zip` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Copiando dados para a tabela db_SamCast.app_multi_plataforma: 0 rows
/*!40000 ALTER TABLE `app_multi_plataforma` DISABLE KEYS */;
/*!40000 ALTER TABLE `app_multi_plataforma` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.app_multi_plataforma_anuncios
CREATE TABLE IF NOT EXISTS `app_multi_plataforma_anuncios` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_app` int(10) NOT NULL,
  `nome` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `banner` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `link` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `data_cadastro` date NOT NULL,
  `exibicoes` int(10) NOT NULL DEFAULT 0,
  `cliques` int(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Copiando dados para a tabela db_SamCast.app_multi_plataforma_anuncios: 0 rows
/*!40000 ALTER TABLE `app_multi_plataforma_anuncios` DISABLE KEYS */;
/*!40000 ALTER TABLE `app_multi_plataforma_anuncios` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.app_multi_plataforma_notificacoes
CREATE TABLE IF NOT EXISTS `app_multi_plataforma_notificacoes` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_stm` int(10) NOT NULL DEFAULT 0,
  `codigo_app` int(10) NOT NULL DEFAULT 0,
  `titulo` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `url_icone` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `url_imagem` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `url_link` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `mensagem` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  `vizualizacoes` int(10) NOT NULL DEFAULT 0,
  `data` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Copiando dados para a tabela db_SamCast.app_multi_plataforma_notificacoes: 0 rows
/*!40000 ALTER TABLE `app_multi_plataforma_notificacoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `app_multi_plataforma_notificacoes` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.atalhos
CREATE TABLE IF NOT EXISTS `atalhos` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_stm` int(10) NOT NULL,
  `menu` varchar(255) NOT NULL,
  `lang` varchar(255) NOT NULL,
  `ordem` int(10) NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.atalhos: 0 rows
/*!40000 ALTER TABLE `atalhos` DISABLE KEYS */;
/*!40000 ALTER TABLE `atalhos` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.avisos
CREATE TABLE IF NOT EXISTS `avisos` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_servidor` int(10) NOT NULL,
  `area` varchar(255) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descricao` longtext NOT NULL,
  `data` date NOT NULL,
  `mensagem` longtext NOT NULL,
  `status` char(3) NOT NULL DEFAULT 'sim',
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.avisos: 0 rows
/*!40000 ALTER TABLE `avisos` DISABLE KEYS */;
/*!40000 ALTER TABLE `avisos` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.avisos_desativados
CREATE TABLE IF NOT EXISTS `avisos_desativados` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_aviso` int(10) NOT NULL,
  `login` varchar(255) NOT NULL,
  `area` varchar(255) NOT NULL,
  `data` date NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.avisos_desativados: 0 rows
/*!40000 ALTER TABLE `avisos_desativados` DISABLE KEYS */;
/*!40000 ALTER TABLE `avisos_desativados` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.bloqueios_login
CREATE TABLE IF NOT EXISTS `bloqueios_login` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_cliente` int(10) NOT NULL,
  `codigo_stm` int(10) NOT NULL,
  `data` datetime NOT NULL,
  `ip` varchar(255) NOT NULL,
  `navegador` varchar(255) NOT NULL,
  `tentativas` int(10) NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.bloqueios_login: 0 rows
/*!40000 ALTER TABLE `bloqueios_login` DISABLE KEYS */;
/*!40000 ALTER TABLE `bloqueios_login` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.certificados
CREATE TABLE IF NOT EXISTS `certificados` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `dominio` varchar(255) NOT NULL,
  `data` datetime NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `status` int(1) NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.certificados: 0 rows
/*!40000 ALTER TABLE `certificados` DISABLE KEYS */;
/*!40000 ALTER TABLE `certificados` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.chat
CREATE TABLE IF NOT EXISTS `chat` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `login` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `nome` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `hash` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `ip` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `msg` longtext COLLATE latin1_general_ci NOT NULL,
  `data` datetime NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Copiando dados para a tabela db_SamCast.chat: 0 rows
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.chat_usuarios
CREATE TABLE IF NOT EXISTS `chat_usuarios` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `nome` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `hash` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `ip` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Copiando dados para a tabela db_SamCast.chat_usuarios: 0 rows
/*!40000 ALTER TABLE `chat_usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_usuarios` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.comerciais_config
CREATE TABLE IF NOT EXISTS `comerciais_config` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_stm` int(10) NOT NULL,
  `codigo_playlist` int(10) NOT NULL,
  `codigo_pasta_comerciais` int(10) NOT NULL,
  `quantidade_comerciais` int(3) DEFAULT 1,
  `intervalo_videos` int(3) DEFAULT 3,
  `ativo` tinyint(1) DEFAULT 1,
  `data_criacao` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`codigo`),
  KEY `idx_codigo_stm` (`codigo_stm`),
  KEY `idx_codigo_playlist` (`codigo_playlist`),
  CONSTRAINT `comerciais_config_ibfk_1` FOREIGN KEY (`codigo_stm`) REFERENCES `revendas` (`codigo`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela db_SamCast.comerciais_config: ~1 rows (aproximadamente)
INSERT INTO `comerciais_config` (`codigo`, `codigo_stm`, `codigo_playlist`, `codigo_pasta_comerciais`, `quantidade_comerciais`, `intervalo_videos`, `ativo`, `data_criacao`) VALUES
	(1, 3, 10, 1, 1, 3, 1, '2025-07-07 21:46:17');

-- Copiando estrutura para tabela db_SamCast.configuracoes
CREATE TABLE IF NOT EXISTS `configuracoes` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `dominio_padrao` varchar(255) NOT NULL,
  `codigo_wowza_servidor_atual` int(10) NOT NULL,
  `manutencao` char(3) NOT NULL DEFAULT 'nao',
  PRIMARY KEY (`codigo`),
  KEY `idx_config_wowza_servidor` (`codigo_wowza_servidor_atual`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.configuracoes: 1 rows
/*!40000 ALTER TABLE `configuracoes` DISABLE KEYS */;
INSERT INTO `configuracoes` (`codigo`, `dominio_padrao`, `codigo_wowza_servidor_atual`, `manutencao`) VALUES
	(1, 'http://samhost.wcore.com.br/', 1, 'nao');
/*!40000 ALTER TABLE `configuracoes` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.dicas_rapidas
CREATE TABLE IF NOT EXISTS `dicas_rapidas` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `mensagem` text NOT NULL,
  `exibir` char(3) NOT NULL DEFAULT 'sim',
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.dicas_rapidas: 0 rows
/*!40000 ALTER TABLE `dicas_rapidas` DISABLE KEYS */;
/*!40000 ALTER TABLE `dicas_rapidas` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.dicas_rapidas_acessos
CREATE TABLE IF NOT EXISTS `dicas_rapidas_acessos` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_stm` int(10) NOT NULL,
  `codigo_dica` int(10) NOT NULL,
  `total` int(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.dicas_rapidas_acessos: 0 rows
/*!40000 ALTER TABLE `dicas_rapidas_acessos` DISABLE KEYS */;
/*!40000 ALTER TABLE `dicas_rapidas_acessos` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.dominios_bloqueados
CREATE TABLE IF NOT EXISTS `dominios_bloqueados` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `dominio` varchar(255) NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.dominios_bloqueados: 0 rows
/*!40000 ALTER TABLE `dominios_bloqueados` DISABLE KEYS */;
/*!40000 ALTER TABLE `dominios_bloqueados` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.espectadores_conectados
CREATE TABLE IF NOT EXISTS `espectadores_conectados` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_stm` int(10) NOT NULL,
  `ip` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `tempo_conectado` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `pais_sigla` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `pais_nome` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `cidade` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `estado` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `player` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `latitude` varchar(255) COLLATE latin1_general_ci NOT NULL DEFAULT '0.0',
  `longitude` varchar(255) COLLATE latin1_general_ci NOT NULL DEFAULT '0.0',
  `atualizacao` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`codigo`),
  KEY `idx_atualizacao` (`atualizacao`),
  KEY `idx_stm_atualizacao` (`codigo_stm`,`atualizacao`)
) ENGINE=MyISAM AUTO_INCREMENT=68 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Copiando dados para a tabela db_SamCast.espectadores_conectados: 0 rows
/*!40000 ALTER TABLE `espectadores_conectados` DISABLE KEYS */;
/*!40000 ALTER TABLE `espectadores_conectados` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.estatisticas
CREATE TABLE IF NOT EXISTS `estatisticas` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_stm` int(10) NOT NULL,
  `data` date NOT NULL,
  `hora` time NOT NULL,
  `ip` varchar(255) NOT NULL DEFAULT '000.000.000.000',
  `pais` varchar(255) NOT NULL,
  `tempo_conectado` int(20) NOT NULL DEFAULT 0,
  `player` varchar(255) NOT NULL,
  `cidade` varchar(255) NOT NULL,
  `estado` varchar(255) NOT NULL,
  PRIMARY KEY (`codigo`),
  KEY `indice_stm` (`codigo_stm`),
  KEY `indice_pais` (`codigo_stm`,`pais`(10)),
  KEY `indice_data` (`codigo_stm`,`data`),
  KEY `indice_tempo_conectado` (`codigo_stm`,`tempo_conectado`),
  KEY `indice_ip` (`codigo_stm`,`ip`(15)),
  KEY `indice_robot` (`codigo_stm`,`data`,`ip`(12)),
  KEY `player` (`player`),
  KEY `codigo_stm` (`codigo_stm`,`data`,`hora`),
  KEY `idx_data_stm` (`data`,`codigo_stm`),
  KEY `idx_pais_stm` (`pais`,`codigo_stm`),
  KEY `idx_tempo_conectado` (`tempo_conectado`)
) ENGINE=MyISAM AUTO_INCREMENT=133 DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.estatisticas: 132 rows
/*!40000 ALTER TABLE `estatisticas` DISABLE KEYS */;
INSERT INTO `estatisticas` (`codigo`, `codigo_stm`, `data`, `hora`, `ip`, `pais`, `tempo_conectado`, `player`, `cidade`, `estado`) VALUES
	(1, 2, '2024-09-19', '00:10:02', '152.248.0.111', 'Brazil', 135, 'HTML5', 'Balsas', 'MaranhÃ£o'),
	(2, 1, '2024-09-19', '05:00:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(3, 2, '2024-09-19', '09:55:01', '177.191.115.66', 'Brazil', 437, 'HTML5', 'UberlÃ¢ndia', 'Minas Gerais'),
	(4, 1, '2024-09-21', '10:20:06', '209.145.62.153', 'United States', 2, 'HTML5', 'St Louis', 'Missouri'),
	(5, 2, '2024-09-21', '10:20:06', '209.145.62.153', 'United States', 1, 'HTML5', 'St Louis', 'Missouri'),
	(6, 1, '2024-09-22', '02:30:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(7, 1, '2024-09-23', '08:00:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(8, 1, '2024-09-24', '09:00:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(9, 2, '2024-09-24', '17:25:02', '177.191.114.14', 'Brazil', 28, 'HTML5', 'UberlÃ¢ndia', 'Minas Gerais'),
	(10, 1, '2024-09-25', '13:00:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(11, 1, '2024-09-26', '03:00:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(12, 1, '2024-09-28', '05:00:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(13, 1, '2024-09-29', '09:00:01', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(14, 1, '2024-10-03', '21:00:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(15, 1, '2024-10-05', '15:10:05', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(16, 1, '2024-10-06', '19:00:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(17, 2, '2024-10-08', '09:40:02', '177.191.112.89', 'Brazil', 17, 'HTML5', 'UberlÃ¢ndia', 'Minas Gerais'),
	(18, 1, '2024-10-08', '10:00:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(19, 2, '2024-10-09', '13:55:02', '177.191.116.16', 'Brazil', 2806, 'HTML5', 'UberlÃ¢ndia', 'Minas Gerais'),
	(20, 1, '2024-10-09', '21:00:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(21, 2, '2024-10-10', '11:20:02', '177.191.113.31', 'Brazil', 3260, 'HTML5', 'UberlÃ¢ndia', 'Minas Gerais'),
	(22, 1, '2024-10-11', '02:00:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(23, 2, '2024-10-11', '09:20:02', '177.191.115.93', 'Brazil', 11, 'HTML5', 'UberlÃ¢ndia', 'Minas Gerais'),
	(24, 1, '2024-10-12', '02:30:16', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(25, 2, '2024-10-12', '16:15:02', '177.191.117.38', 'Brazil', 16835, 'HTML5', 'UberlÃ¢ndia', 'Minas Gerais'),
	(26, 1, '2024-10-13', '00:00:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(27, 1, '2024-10-14', '03:00:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(28, 2, '2024-10-14', '11:10:02', '177.191.112.47', 'Brazil', 2, 'HTML5', 'UberlÃ¢ndia', 'Minas Gerais'),
	(29, 1, '2024-10-15', '02:00:04', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(30, 1, '2024-10-16', '12:00:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(31, 2, '2024-10-17', '15:05:01', '177.191.116.164', 'Brazil', 14, 'HTML5', 'UberlÃ¢ndia', 'Minas Gerais'),
	(32, 1, '2024-10-18', '05:00:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(33, 1, '2024-10-19', '17:00:13', '209.145.62.153', 'United States', 6, 'HTML5', 'St Louis', 'Missouri'),
	(34, 2, '2024-10-19', '17:00:13', '209.145.62.153', 'United States', 3, 'HTML5', 'St Louis', 'Missouri'),
	(35, 1, '2024-10-21', '05:50:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(36, 2, '2024-10-22', '10:10:03', '177.191.113.168', 'Brazil', 6, 'HTML5', 'UberlÃ¢ndia', 'Minas Gerais'),
	(37, 1, '2024-10-22', '16:00:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(38, 1, '2024-10-24', '15:00:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(39, 1, '2024-10-26', '05:00:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(40, 2, '2024-10-28', '10:00:03', '177.191.116.48', 'Brazil', 480, 'HTML5', 'UberlÃ¢ndia', 'Minas Gerais'),
	(41, 1, '2024-10-29', '14:00:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(42, 1, '2024-10-31', '08:00:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(43, 2, '2024-11-01', '10:25:03', '177.191.113.254', 'Brazil', 6306, 'HTML5', 'UberlÃ¢ndia', 'Minas Gerais'),
	(44, 1, '2024-11-01', '22:20:03', '209.145.62.153', 'United States', 1, 'HTML5', 'St Louis', 'Missouri'),
	(45, 2, '2024-11-01', '22:20:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(46, 1, '2024-11-03', '14:10:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(47, 1, '2024-11-04', '08:20:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(48, 1, '2024-11-05', '03:00:04', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(49, 1, '2024-11-06', '23:40:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(50, 1, '2024-11-07', '09:00:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(51, 1, '2024-11-08', '06:30:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(52, 2, '2024-11-08', '09:45:02', '177.191.116.225', 'Brazil', 7680, 'HTML5', 'UberlÃ¢ndia', 'Minas Gerais'),
	(53, 1, '2024-11-09', '20:20:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(54, 1, '2024-11-10', '03:00:04', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(55, 1, '2024-11-11', '05:00:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(56, 2, '2024-11-11', '15:00:03', '177.191.113.114', 'Brazil', 3185, 'HTML5', 'UberlÃ¢ndia', 'Minas Gerais'),
	(57, 2, '2024-11-12', '09:50:03', '177.191.112.230', 'Brazil', 3136, 'HTML5', 'UberlÃ¢ndia', 'Minas Gerais'),
	(58, 1, '2024-11-12', '20:30:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(59, 1, '2024-11-13', '01:10:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(60, 1, '2024-11-14', '16:50:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(61, 1, '2024-11-15', '20:20:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(62, 1, '2024-11-16', '05:20:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(63, 1, '2024-11-17', '03:00:06', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(64, 1, '2024-11-18', '02:30:04', '209.145.62.153', 'United States', 1, 'HTML5', 'St Louis', 'Missouri'),
	(65, 3, '2024-11-18', '02:30:04', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(66, 2, '2024-11-18', '02:30:04', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(67, 1, '2024-11-19', '03:00:04', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(68, 1, '2024-11-20', '03:00:04', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(69, 1, '2024-11-22', '15:00:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(70, 1, '2024-11-23', '00:50:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(71, 1, '2024-11-24', '02:00:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(72, 1, '2024-11-25', '20:30:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(73, 2, '2024-11-26', '08:55:02', '177.191.113.243', 'Brazil', 3, 'HTML5', 'UberlÃ¢ndia', 'Minas Gerais'),
	(74, 1, '2024-11-27', '04:30:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(75, 2, '2024-11-27', '16:40:02', '177.191.116.22', 'Brazil', 19, 'HTML5', 'UberlÃ¢ndia', 'Minas Gerais'),
	(76, 1, '2024-11-28', '11:20:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(77, 1, '2024-11-29', '05:00:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(78, 1, '2024-11-30', '03:00:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(79, 1, '2024-12-01', '09:00:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(80, 1, '2024-12-03', '09:00:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(81, 1, '2024-12-04', '01:30:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(82, 1, '2024-12-06', '09:40:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(83, 1, '2024-12-07', '05:10:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(84, 1, '2024-12-08', '19:40:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(85, 1, '2024-12-09', '16:30:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(86, 1, '2024-12-10', '00:30:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(87, 1, '2024-12-11', '04:30:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(88, 1, '2024-12-12', '10:50:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(89, 1, '2024-12-13', '07:20:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(90, 1, '2024-12-14', '15:20:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(91, 1, '2024-12-15', '07:30:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(92, 1, '2024-12-16', '19:40:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(93, 1, '2024-12-17', '16:00:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(94, 1, '2024-12-18', '05:30:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(95, 1, '2024-12-19', '15:00:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(96, 1, '2024-12-20', '00:10:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(97, 1, '2024-12-21', '01:10:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(98, 1, '2024-12-22', '19:10:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(99, 1, '2024-12-23', '02:50:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(100, 1, '2024-12-24', '03:00:04', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(101, 1, '2024-12-26', '04:00:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(102, 1, '2024-12-27', '03:00:04', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(103, 1, '2024-12-28', '07:30:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(104, 1, '2024-12-29', '06:30:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(105, 1, '2024-12-30', '01:30:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(106, 1, '2024-12-31', '03:40:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(107, 1, '2025-01-01', '20:00:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(108, 1, '2025-01-02', '12:00:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(109, 1, '2025-01-03', '02:40:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(110, 1, '2025-01-04', '00:00:04', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(111, 1, '2025-01-05', '03:00:05', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(112, 1, '2025-01-06', '01:30:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(113, 1, '2025-01-07', '03:00:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(114, 1, '2025-01-08', '01:50:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(115, 1, '2025-01-09', '03:50:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(116, 1, '2025-01-10', '18:10:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(117, 1, '2025-01-11', '00:50:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(118, 1, '2025-01-12', '01:50:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(119, 1, '2025-01-13', '03:00:05', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(120, 1, '2025-01-14', '09:00:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(121, 1, '2025-01-15', '00:20:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(123, 1, '2025-01-16', '03:30:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(122, 3, '2025-01-15', '05:40:04', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(124, 1, '2025-01-17', '02:00:04', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(125, 1, '2025-01-18', '05:00:04', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(126, 1, '2025-01-19', '18:20:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(127, 1, '2025-01-20', '01:40:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(128, 1, '2025-01-21', '00:00:04', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(129, 1, '2025-01-22', '02:00:03', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(130, 1, '2025-01-23', '00:50:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(131, 1, '2025-01-24', '13:20:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri'),
	(132, 1, '2025-01-25', '05:00:02', '209.145.62.153', 'United States', 0, 'HTML5', 'St Louis', 'Missouri');
/*!40000 ALTER TABLE `estatisticas` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.geoip
CREATE TABLE IF NOT EXISTS `geoip` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `ip` varchar(255) NOT NULL,
  `pais_sigla` varchar(255) NOT NULL,
  `pais_nome` varchar(255) NOT NULL,
  `estado` varchar(255) NOT NULL,
  `cidade` varchar(255) NOT NULL,
  `latitude` varchar(255) NOT NULL DEFAULT '0.0',
  `longitude` varchar(255) NOT NULL DEFAULT '0.0',
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.geoip: 19 rows
/*!40000 ALTER TABLE `geoip` DISABLE KEYS */;
INSERT INTO `geoip` (`codigo`, `ip`, `pais_sigla`, `pais_nome`, `estado`, `cidade`, `latitude`, `longitude`) VALUES
	(1, '152.248.0.111', 'BR', 'Brazil', 'MaranhÃ£o', 'Balsas', '-8.4273', '-46.4855'),
	(2, '209.145.62.153', 'US', 'United States', 'Missouri', 'St Louis', '38.6364', '-90.1985'),
	(3, '177.191.115.66', 'BR', 'Brazil', 'Minas Gerais', 'UberlÃ¢ndia', '-19.0243', '-48.3428'),
	(4, '177.191.114.14', 'BR', 'Brazil', 'Minas Gerais', 'UberlÃ¢ndia', '-19.0243', '-48.3428'),
	(5, '177.191.112.89', 'BR', 'Brazil', 'Minas Gerais', 'UberlÃ¢ndia', '-19.0243', '-48.3428'),
	(6, '177.191.116.16', 'BR', 'Brazil', 'Minas Gerais', 'UberlÃ¢ndia', '-19.0243', '-48.3428'),
	(7, '177.191.113.31', 'BR', 'Brazil', 'Minas Gerais', 'UberlÃ¢ndia', '-19.0243', '-48.3428'),
	(8, '177.191.115.93', 'BR', 'Brazil', 'Minas Gerais', 'UberlÃ¢ndia', '-19.0243', '-48.3428'),
	(9, '177.191.117.38', 'BR', 'Brazil', 'Minas Gerais', 'UberlÃ¢ndia', '-19.0243', '-48.3428'),
	(10, '177.191.112.47', 'BR', 'Brazil', 'Minas Gerais', 'UberlÃ¢ndia', '-19.0243', '-48.3428'),
	(11, '177.191.116.164', 'BR', 'Brazil', 'Minas Gerais', 'UberlÃ¢ndia', '-19.0243', '-48.3428'),
	(12, '177.191.113.168', 'BR', 'Brazil', 'Minas Gerais', 'UberlÃ¢ndia', '-19.0243', '-48.3428'),
	(13, '177.191.116.48', 'BR', 'Brazil', 'Minas Gerais', 'UberlÃ¢ndia', '-19.0243', '-48.3428'),
	(14, '177.191.113.254', 'BR', 'Brazil', 'Minas Gerais', 'UberlÃ¢ndia', '-19.0243', '-48.3428'),
	(15, '177.191.116.225', 'BR', 'Brazil', 'Minas Gerais', 'UberlÃ¢ndia', '-19.0243', '-48.3428'),
	(16, '177.191.113.114', 'BR', 'Brazil', 'Minas Gerais', 'UberlÃ¢ndia', '-19.0243', '-48.3428'),
	(17, '177.191.112.230', 'BR', 'Brazil', 'Minas Gerais', 'UberlÃ¢ndia', '-19.0243', '-48.3428'),
	(18, '177.191.113.243', 'BR', 'Brazil', 'Minas Gerais', 'UberlÃ¢ndia', '-19.0243', '-48.3428'),
	(19, '177.191.116.22', 'BR', 'Brazil', 'Minas Gerais', 'UberlÃ¢ndia', '-19.0243', '-48.3428');
/*!40000 ALTER TABLE `geoip` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.geoip_paises
CREATE TABLE IF NOT EXISTS `geoip_paises` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `sigla` char(2) COLLATE latin1_general_ci NOT NULL,
  `nome` varchar(255) COLLATE latin1_general_ci NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM AUTO_INCREMENT=253 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Copiando dados para a tabela db_SamCast.geoip_paises: 252 rows
/*!40000 ALTER TABLE `geoip_paises` DISABLE KEYS */;
INSERT INTO `geoip_paises` (`codigo`, `sigla`, `nome`) VALUES
	(1, 'AF', 'Afghanistan'),
	(2, 'AX', 'Aland Islands'),
	(3, 'AL', 'Albania'),
	(4, 'DZ', 'Algeria'),
	(5, 'AS', 'American Samoa'),
	(6, 'AD', 'Andorra'),
	(7, 'AO', 'Angola'),
	(8, 'AI', 'Anguilla'),
	(9, 'AQ', 'Antarctica'),
	(10, 'AG', 'Antigua and Barbuda'),
	(11, 'AR', 'Argentina'),
	(12, 'AM', 'Armenia'),
	(13, 'AW', 'Aruba'),
	(14, 'AU', 'Australia'),
	(15, 'AT', 'Austria'),
	(16, 'AZ', 'Azerbaijan'),
	(17, 'BS', 'Bahamas'),
	(18, 'BH', 'Bahrain'),
	(19, 'BD', 'Bangladesh'),
	(20, 'BB', 'Barbados'),
	(21, 'BY', 'Belarus'),
	(22, 'BE', 'Belgium'),
	(23, 'BZ', 'Belize'),
	(24, 'BJ', 'Benin'),
	(25, 'BM', 'Bermuda'),
	(26, 'BT', 'Bhutan'),
	(27, 'BO', 'Bolivia'),
	(28, 'BQ', 'Bonaire, Sint Eustatius and Saba'),
	(29, 'BA', 'Bosnia and Herzegovina'),
	(30, 'BW', 'Botswana'),
	(31, 'BV', 'Bouvet Island'),
	(32, 'BR', 'Brazil'),
	(33, 'IO', 'British Indian Ocean Territory'),
	(34, 'BN', 'Brunei Darussalam'),
	(35, 'BG', 'Bulgaria'),
	(36, 'BF', 'Burkina Faso'),
	(37, 'BI', 'Burundi'),
	(38, 'KH', 'Cambodia'),
	(39, 'CM', 'Cameroon'),
	(40, 'CA', 'Canada'),
	(41, 'CV', 'Cape Verde'),
	(42, 'KY', 'Cayman Islands'),
	(43, 'CF', 'Central African Republic'),
	(44, 'TD', 'Chad'),
	(45, 'CL', 'Chile'),
	(46, 'CN', 'China'),
	(47, 'CX', 'Christmas Island'),
	(48, 'CC', 'Cocos (Keeling) Islands'),
	(49, 'CO', 'Colombia'),
	(50, 'KM', 'Comoros'),
	(51, 'CG', 'Congo'),
	(52, 'CD', 'Congo, Democratic Republic of the Congo'),
	(53, 'CK', 'Cook Islands'),
	(54, 'CR', 'Costa Rica'),
	(55, 'CI', 'Cote D\'Ivoire'),
	(56, 'HR', 'Croatia'),
	(57, 'CU', 'Cuba'),
	(58, 'CW', 'Curacao'),
	(59, 'CY', 'Cyprus'),
	(60, 'CZ', 'Czech Republic'),
	(61, 'DK', 'Denmark'),
	(62, 'DJ', 'Djibouti'),
	(63, 'DM', 'Dominica'),
	(64, 'DO', 'Dominican Republic'),
	(65, 'EC', 'Ecuador'),
	(66, 'EG', 'Egypt'),
	(67, 'SV', 'El Salvador'),
	(68, 'GQ', 'Equatorial Guinea'),
	(69, 'ER', 'Eritrea'),
	(70, 'EE', 'Estonia'),
	(71, 'ET', 'Ethiopia'),
	(72, 'FK', 'Falkland Islands (Malvinas)'),
	(73, 'FO', 'Faroe Islands'),
	(74, 'FJ', 'Fiji'),
	(75, 'FI', 'Finland'),
	(76, 'FR', 'France'),
	(77, 'GF', 'French Guiana'),
	(78, 'PF', 'French Polynesia'),
	(79, 'TF', 'French Southern Territories'),
	(80, 'GA', 'Gabon'),
	(81, 'GM', 'Gambia'),
	(82, 'GE', 'Georgia'),
	(83, 'DE', 'Germany'),
	(84, 'GH', 'Ghana'),
	(85, 'GI', 'Gibraltar'),
	(86, 'GR', 'Greece'),
	(87, 'GL', 'Greenland'),
	(88, 'GD', 'Grenada'),
	(89, 'GP', 'Guadeloupe'),
	(90, 'GU', 'Guam'),
	(91, 'GT', 'Guatemala'),
	(92, 'GG', 'Guernsey'),
	(93, 'GN', 'Guinea'),
	(94, 'GW', 'Guinea-Bissau'),
	(95, 'GY', 'Guyana'),
	(96, 'HT', 'Haiti'),
	(97, 'HM', 'Heard Island and Mcdonald Islands'),
	(98, 'VA', 'Holy See (Vatican City State)'),
	(99, 'HN', 'Honduras'),
	(100, 'HK', 'Hong Kong'),
	(101, 'HU', 'Hungary'),
	(102, 'IS', 'Iceland'),
	(103, 'IN', 'India'),
	(104, 'ID', 'Indonesia'),
	(105, 'IR', 'Iran, Islamic Republic of'),
	(106, 'IQ', 'Iraq'),
	(107, 'IE', 'Ireland'),
	(108, 'IM', 'Isle of Man'),
	(109, 'IL', 'Israel'),
	(110, 'IT', 'Italy'),
	(111, 'JM', 'Jamaica'),
	(112, 'JP', 'Japan'),
	(113, 'JE', 'Jersey'),
	(114, 'JO', 'Jordan'),
	(115, 'KZ', 'Kazakhstan'),
	(116, 'KE', 'Kenya'),
	(117, 'KI', 'Kiribati'),
	(118, 'KP', 'Korea, Democratic People\'s Republic of'),
	(119, 'KR', 'Korea, Republic of'),
	(120, 'XK', 'Kosovo'),
	(121, 'KW', 'Kuwait'),
	(122, 'KG', 'Kyrgyzstan'),
	(123, 'LA', 'Lao People\'s Democratic Republic'),
	(124, 'LV', 'Latvia'),
	(125, 'LB', 'Lebanon'),
	(126, 'LS', 'Lesotho'),
	(127, 'LR', 'Liberia'),
	(128, 'LY', 'Libyan Arab Jamahiriya'),
	(129, 'LI', 'Liechtenstein'),
	(130, 'LT', 'Lithuania'),
	(131, 'LU', 'Luxembourg'),
	(132, 'MO', 'Macao'),
	(133, 'MK', 'Macedonia, the Former Yugoslav Republic of'),
	(134, 'MG', 'Madagascar'),
	(135, 'MW', 'Malawi'),
	(136, 'MY', 'Malaysia'),
	(137, 'MV', 'Maldives'),
	(138, 'ML', 'Mali'),
	(139, 'MT', 'Malta'),
	(140, 'MH', 'Marshall Islands'),
	(141, 'MQ', 'Martinique'),
	(142, 'MR', 'Mauritania'),
	(143, 'MU', 'Mauritius'),
	(144, 'YT', 'Mayotte'),
	(145, 'MX', 'Mexico'),
	(146, 'FM', 'Micronesia, Federated States of'),
	(147, 'MD', 'Moldova, Republic of'),
	(148, 'MC', 'Monaco'),
	(149, 'MN', 'Mongolia'),
	(150, 'ME', 'Montenegro'),
	(151, 'MS', 'Montserrat'),
	(152, 'MA', 'Morocco'),
	(153, 'MZ', 'Mozambique'),
	(154, 'MM', 'Myanmar'),
	(155, 'NA', 'Namibia'),
	(156, 'NR', 'Nauru'),
	(157, 'NP', 'Nepal'),
	(158, 'NL', 'Netherlands'),
	(159, 'AN', 'Netherlands Antilles'),
	(160, 'NC', 'New Caledonia'),
	(161, 'NZ', 'New Zealand'),
	(162, 'NI', 'Nicaragua'),
	(163, 'NE', 'Niger'),
	(164, 'NG', 'Nigeria'),
	(165, 'NU', 'Niue'),
	(166, 'NF', 'Norfolk Island'),
	(167, 'MP', 'Northern Mariana Islands'),
	(168, 'NO', 'Norway'),
	(169, 'OM', 'Oman'),
	(170, 'PK', 'Pakistan'),
	(171, 'PW', 'Palau'),
	(172, 'PS', 'Palestinian Territory, Occupied'),
	(173, 'PA', 'Panama'),
	(174, 'PG', 'Papua New Guinea'),
	(175, 'PY', 'Paraguay'),
	(176, 'PE', 'Peru'),
	(177, 'PH', 'Philippines'),
	(178, 'PN', 'Pitcairn'),
	(179, 'PL', 'Poland'),
	(180, 'PT', 'Portugal'),
	(181, 'PR', 'Puerto Rico'),
	(182, 'QA', 'Qatar'),
	(183, 'RE', 'Reunion'),
	(184, 'RO', 'Romania'),
	(185, 'RU', 'Russian Federation'),
	(186, 'RW', 'Rwanda'),
	(187, 'BL', 'Saint Barthelemy'),
	(188, 'SH', 'Saint Helena'),
	(189, 'KN', 'Saint Kitts and Nevis'),
	(190, 'LC', 'Saint Lucia'),
	(191, 'MF', 'Saint Martin'),
	(192, 'PM', 'Saint Pierre and Miquelon'),
	(193, 'VC', 'Saint Vincent and the Grenadines'),
	(194, 'WS', 'Samoa'),
	(195, 'SM', 'San Marino'),
	(196, 'ST', 'Sao Tome and Principe'),
	(197, 'SA', 'Saudi Arabia'),
	(198, 'SN', 'Senegal'),
	(199, 'RS', 'Serbia'),
	(200, 'CS', 'Serbia and Montenegro'),
	(201, 'SC', 'Seychelles'),
	(202, 'SL', 'Sierra Leone'),
	(203, 'SG', 'Singapore'),
	(204, 'SX', 'Sint Maarten'),
	(205, 'SK', 'Slovakia'),
	(206, 'SI', 'Slovenia'),
	(207, 'SB', 'Solomon Islands'),
	(208, 'SO', 'Somalia'),
	(209, 'ZA', 'South Africa'),
	(210, 'GS', 'South Georgia and the South Sandwich Islands'),
	(211, 'SS', 'South Sudan'),
	(212, 'ES', 'Spain'),
	(213, 'LK', 'Sri Lanka'),
	(214, 'SD', 'Sudan'),
	(215, 'SR', 'Suriname'),
	(216, 'SJ', 'Svalbard and Jan Mayen'),
	(217, 'SZ', 'Swaziland'),
	(218, 'SE', 'Sweden'),
	(219, 'CH', 'Switzerland'),
	(220, 'SY', 'Syrian Arab Republic'),
	(221, 'TW', 'Taiwan, Province of China'),
	(222, 'TJ', 'Tajikistan'),
	(223, 'TZ', 'Tanzania, United Republic of'),
	(224, 'TH', 'Thailand'),
	(225, 'TL', 'Timor-Leste'),
	(226, 'TG', 'Togo'),
	(227, 'TK', 'Tokelau'),
	(228, 'TO', 'Tonga'),
	(229, 'TT', 'Trinidad and Tobago'),
	(230, 'TN', 'Tunisia'),
	(231, 'TR', 'Turkey'),
	(232, 'TM', 'Turkmenistan'),
	(233, 'TC', 'Turks and Caicos Islands'),
	(234, 'TV', 'Tuvalu'),
	(235, 'UG', 'Uganda'),
	(236, 'UA', 'Ukraine'),
	(237, 'AE', 'United Arab Emirates'),
	(238, 'GB', 'United Kingdom'),
	(239, 'US', 'United States'),
	(240, 'UM', 'United States Minor Outlying Islands'),
	(241, 'UY', 'Uruguay'),
	(242, 'UZ', 'Uzbekistan'),
	(243, 'VU', 'Vanuatu'),
	(244, 'VE', 'Venezuela'),
	(245, 'VN', 'Viet Nam'),
	(246, 'VG', 'Virgin Islands, British'),
	(247, 'VI', 'Virgin Islands, U.s.'),
	(248, 'WF', 'Wallis and Futuna'),
	(249, 'EH', 'Western Sahara'),
	(250, 'YE', 'Yemen'),
	(251, 'ZM', 'Zambia'),
	(252, 'ZW', 'Zimbabwe');
/*!40000 ALTER TABLE `geoip_paises` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.ip_cameras
CREATE TABLE IF NOT EXISTS `ip_cameras` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_stm` int(10) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `rtsp` text NOT NULL,
  `stream` varchar(255) NOT NULL,
  `data_cadastro` datetime NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.ip_cameras: 0 rows
/*!40000 ALTER TABLE `ip_cameras` DISABLE KEYS */;
/*!40000 ALTER TABLE `ip_cameras` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.lives
CREATE TABLE IF NOT EXISTS `lives` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_stm` int(10) NOT NULL,
  `data_inicio` datetime NOT NULL,
  `data_fim` datetime NOT NULL,
  `tipo` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `live_servidor` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `live_app` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `live_chave` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `status` int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Copiando dados para a tabela db_SamCast.lives: 0 rows
/*!40000 ALTER TABLE `lives` DISABLE KEYS */;
/*!40000 ALTER TABLE `lives` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.logos
CREATE TABLE IF NOT EXISTS `logos` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_stm` int(10) NOT NULL,
  `nome` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `arquivo` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tamanho` int(10) NOT NULL DEFAULT 0,
  `tipo_arquivo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_upload` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`codigo`),
  KEY `idx_codigo_stm` (`codigo_stm`),
  CONSTRAINT `logos_ibfk_1` FOREIGN KEY (`codigo_stm`) REFERENCES `revendas` (`codigo`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela db_SamCast.logos: ~1 rows (aproximadamente)
INSERT INTO `logos` (`codigo`, `codigo_stm`, `nome`, `arquivo`, `tamanho`, `tipo_arquivo`, `data_upload`) VALUES
	(1, 3, 'teste', '/logos/1751914142318_133913941978805415.jpg', 2290900, 'image/jpeg', '2025-07-07 21:49:02');

-- Copiando estrutura para tabela db_SamCast.logs
CREATE TABLE IF NOT EXISTS `logs` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `data` datetime NOT NULL,
  `host` varchar(255) NOT NULL DEFAULT 'http://',
  `ip` varchar(255) NOT NULL,
  `navegador` varchar(255) NOT NULL,
  `log` text NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.logs: 5 rows
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
INSERT INTO `logs` (`codigo`, `data`, `host`, `ip`, `navegador`, `log`) VALUES
	(1, '2024-09-18 23:59:09', 'http://udicast.com', '186.114.32.32', 'Chrome 128.0.0.0', '[demo] Acesso administrativo ao painel deo streaming executado com sucesso.'),
	(2, '2024-09-19 00:07:42', 'http://udicast.com', '152.248.0.111', 'Chrome 128.0.0.0', '[wcore] Acesso da revenda ao painel de streaming executado com sucesso.'),
	(3, '2024-09-21 04:58:37', 'http://udicast.com', '152.248.7.144', 'Chrome 128.0.0.0', '[wcore] Acesso da revenda ao painel de streaming executado com sucesso.'),
	(4, '2024-10-10 09:33:03', 'http://udicast.com', '177.191.117.145', 'Chrome 129.0.0.0', '[demo] Acesso da revenda ao painel de streaming executado com sucesso.'),
	(5, '2024-11-13 11:42:58', 'http://udicast.com', '216.238.112.124', 'Chrome 130.0.0.0', '[teste] Acesso da revenda ao painel de streaming executado com sucesso.');
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.logs_streamings
CREATE TABLE IF NOT EXISTS `logs_streamings` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_stm` int(10) NOT NULL,
  `data` datetime NOT NULL,
  `host` varchar(255) NOT NULL,
  `ip` varchar(255) NOT NULL,
  `navegador` varchar(255) NOT NULL,
  `log` text NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM AUTO_INCREMENT=104 DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.logs_streamings: 103 rows
/*!40000 ALTER TABLE `logs_streamings` DISABLE KEYS */;
INSERT INTO `logs_streamings` (`codigo`, `codigo_stm`, `data`, `host`, `ip`, `navegador`, `log`) VALUES
	(1, 1, '2024-09-18 23:58:22', 'http://udicast.com', '186.114.32.32', 'Chrome 128.0.0.0', 'Streaming ligado com sucesso pelo administrador.'),
	(2, 1, '2024-09-18 23:58:29', 'http://udicast.com', '186.114.32.32', 'Chrome 128.0.0.0', 'Streaming ligado com sucesso pelo administrador.'),
	(3, 1, '2024-09-19 00:00:08', 'http://udicast.com', '186.114.32.32', 'Chrome 128.0.0.0', 'Streaming sincronizado com sucesso no servidor.'),
	(4, 1, '2024-09-19 00:00:11', 'http://udicast.com', '186.114.32.32', 'Chrome 128.0.0.0', 'A playlist serÃ¡ iniciada em alguns minutos.'),
	(5, 2, '2024-09-19 08:53:32', 'http://udicast.com', '177.191.115.66', 'Chrome 128.0.0.0', 'Acessou o painel de controle.'),
	(6, 2, '2024-09-19 08:53:59', 'http://udicast.com', '177.191.115.66', 'Chrome 128.0.0.0', 'O streaming jÃ¡ esta ligado.'),
	(7, 2, '2024-09-19 09:52:29', 'http://udicast.com', '177.191.115.66', 'Chrome 128.0.0.0', 'A playlist serÃ¡ iniciada em alguns minutos.'),
	(8, 2, '2024-09-19 10:01:24', 'http://udicast.com', '177.191.115.66', 'Chrome 128.0.0.0', 'Streaming desligado com sucesso.'),
	(9, 2, '2024-09-19 10:04:13', 'http://udicast.com', '177.191.115.66', 'Chrome 128.0.0.0', 'Streaming desligado com sucesso.'),
	(10, 2, '2024-09-19 10:04:25', 'http://udicast.com', '177.191.115.66', 'Chrome 128.0.0.0', 'O streaming jÃ¡ esta ligado.'),
	(11, 2, '2024-09-19 10:04:49', 'http://udicast.com', '177.191.115.66', 'Chrome 128.0.0.0', 'Streaming desligado com sucesso.'),
	(12, 2, '2024-09-23 11:43:23', 'http://udicast.com', '177.191.114.229', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(13, 2, '2024-09-23 14:00:17', 'http://udicast.com', '177.191.114.229', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(14, 2, '2024-09-23 17:25:12', 'http://udicast.com', '177.191.114.229', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(15, 2, '2024-09-24 09:06:57', 'http://udicast.com', '177.191.114.14', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(16, 2, '2024-09-24 16:03:35', 'http://udicast.com', '177.191.114.14', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(17, 2, '2024-09-25 17:36:28', 'http://udicast.com', '177.191.116.24', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(18, 2, '2024-09-26 16:15:50', 'http://udicast.com', '177.191.113.236', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(19, 2, '2024-09-26 16:26:28', 'http://udicast.com', '177.191.113.236', 'Chrome 129.0.0.0', 'A playlist serÃ¡ iniciada em alguns minutos.'),
	(20, 2, '2024-09-26 16:26:58', 'http://udicast.com', '177.191.113.236', 'Chrome 129.0.0.0', 'O streaming jÃ¡ esta ligado.'),
	(21, 2, '2024-09-26 16:27:53', 'http://udicast.com', '177.191.113.236', 'Chrome 129.0.0.0', 'A playlist serÃ¡ iniciada em alguns minutos.'),
	(22, 2, '2024-09-26 16:28:04', 'http://udicast.com', '177.191.113.236', 'Chrome 129.0.0.0', 'Saiu do painel de controle.'),
	(23, 2, '2024-09-26 16:28:06', 'http://udicast.com', '177.191.113.236', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(24, 2, '2024-09-27 08:45:43', 'http://udicast.com', '177.191.113.236', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(25, 2, '2024-09-27 08:46:04', 'http://udicast.com', '177.191.113.236', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(26, 2, '2024-09-27 10:20:35', 'http://udicast.com', '177.191.113.236', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(27, 2, '2024-09-27 10:22:52', 'http://udicast.com', '177.191.113.236', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(28, 2, '2024-10-08 09:05:38', 'http://udicast.com', '177.191.112.89', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(29, 2, '2024-10-08 09:39:36', 'http://udicast.com', '177.191.112.89', 'Chrome 129.0.0.0', 'O streaming jÃ¡ esta ligado.'),
	(30, 2, '2024-10-08 09:41:31', 'http://udicast.com', '177.191.112.89', 'Chrome 129.0.0.0', 'Streaming desligado com sucesso.'),
	(31, 2, '2024-10-08 09:41:57', 'http://udicast.com', '177.191.112.89', 'Chrome 129.0.0.0', 'Saiu do painel de controle.'),
	(32, 2, '2024-10-08 09:41:59', 'http://udicast.com', '177.191.112.89', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(33, 2, '2024-10-08 09:42:08', 'http://udicast.com', '177.191.112.89', 'Chrome 129.0.0.0', 'Streaming desligado com sucesso.'),
	(34, 2, '2024-10-08 09:42:49', 'http://udicast.com', '177.191.112.89', 'Chrome 129.0.0.0', 'Saiu do painel de controle.'),
	(35, 2, '2024-10-08 09:42:51', 'http://udicast.com', '177.191.112.89', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(36, 2, '2024-10-08 09:43:03', 'http://udicast.com', '177.191.112.89', 'Chrome 129.0.0.0', 'O streaming jÃ¡ esta ligado.'),
	(37, 2, '2024-10-08 09:43:19', 'http://udicast.com', '177.191.112.89', 'Chrome 129.0.0.0', 'O streaming jÃ¡ esta ligado.'),
	(38, 2, '2024-10-08 10:31:50', 'http://udicast.com', '177.191.112.89', 'Chrome 129.0.0.0', 'O streaming jÃ¡ esta ligado.'),
	(39, 2, '2024-10-09 09:08:12', 'http://udicast.com', '177.191.116.16', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(40, 2, '2024-10-09 13:51:43', 'http://udicast.com', '177.191.116.16', 'Chrome 129.0.0.0', 'O streaming jÃ¡ esta ligado.'),
	(41, 2, '2024-10-09 14:14:31', 'http://udicast.com', '177.191.116.16', 'Chrome 129.0.0.0', 'Streaming reiniciado com sucesso.'),
	(42, 2, '2024-10-09 14:40:14', 'http://udicast.com', '177.191.116.16', 'Chrome 129.0.0.0', 'O streaming jÃ¡ esta ligado.'),
	(43, 2, '2024-10-09 14:42:32', 'http://udicast.com', '177.191.116.16', 'Chrome 129.0.0.0', 'O streaming jÃ¡ esta ligado.'),
	(44, 2, '2024-10-09 15:21:05', 'http://udicast.com', '177.191.116.16', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(45, 2, '2024-10-09 15:33:08', 'http://udicast.com', '177.191.116.16', 'Chrome 129.0.0.0', 'O streaming jÃ¡ esta ligado.'),
	(46, 2, '2024-10-10 09:14:23', 'http://udicast.com', '177.191.113.31', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(47, 2, '2024-10-10 09:47:27', 'http://udicast.com', '177.191.113.31', 'Chrome 129.0.0.0', 'O streaming jÃ¡ esta ligado.'),
	(48, 2, '2024-10-10 10:25:58', 'http://udicast.com', '177.191.113.31', 'Chrome 129.0.0.0', 'O streaming jÃ¡ esta ligado.'),
	(49, 2, '2024-10-10 14:49:15', 'http://udicast.com', '177.191.113.31', 'Chrome 129.0.0.0', 'O streaming jÃ¡ esta ligado.'),
	(50, 2, '2024-10-10 15:36:04', 'http://udicast.com', '177.191.113.31', 'Chrome 129.0.0.0', 'O streaming jÃ¡ esta ligado.'),
	(51, 2, '2024-10-10 15:51:39', 'http://udicast.com', '177.191.113.31', 'Chrome 129.0.0.0', 'O streaming jÃ¡ esta ligado.'),
	(52, 2, '2024-10-10 16:26:10', 'http://udicast.com', '177.191.113.31', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(53, 2, '2024-10-11 09:19:34', 'http://udicast.com', '177.191.115.93', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(54, 2, '2024-10-11 09:20:07', 'http://udicast.com', '177.191.115.93', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(55, 2, '2024-10-12 16:11:00', 'http://udicast.com', '177.191.117.38', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(56, 2, '2024-10-12 16:12:36', 'http://udicast.com', '177.191.117.38', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(57, 2, '2024-10-12 16:14:03', 'http://udicast.com', '177.191.117.38', 'Chrome 129.0.0.0', 'Saiu do painel de controle.'),
	(58, 2, '2024-10-12 16:14:18', 'http://udicast.com', '177.191.117.38', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(59, 2, '2024-10-12 16:58:51', 'http://udicast.com', '177.191.117.38', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(60, 2, '2024-10-14 11:06:40', 'http://udicast.com', '177.191.112.47', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(61, 2, '2024-10-14 11:07:24', 'http://udicast.com', '177.191.112.47', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(62, 2, '2024-10-14 11:10:13', 'http://udicast.com', '177.51.51.78', 'Safari 604.1', 'Acessou o painel de controle.'),
	(63, 2, '2024-10-14 15:07:49', 'http://udicast.com', '177.191.112.47', 'Chrome 129.0.0.0', 'O streaming jÃ¡ esta ligado.'),
	(64, 2, '2024-10-14 15:13:42', 'http://udicast.com', '177.191.112.47', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(65, 2, '2024-10-14 15:49:56', 'http://udicast.com', '177.191.112.47', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(66, 2, '2024-10-14 15:59:25', 'http://udicast.com', '177.191.112.47', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(67, 2, '2024-10-15 10:24:29', 'http://udicast.com', '177.191.112.166', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(68, 2, '2024-10-15 10:56:54', 'http://udicast.com', '177.191.112.166', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(69, 2, '2024-10-15 16:08:30', 'http://udicast.com', '177.191.112.166', 'Chrome 129.0.0.0', 'Saiu do painel de controle.'),
	(70, 2, '2024-10-16 08:51:55', 'http://udicast.com', '177.191.114.45', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(71, 2, '2024-10-16 08:55:24', 'http://udicast.com', '177.191.114.45', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(72, 2, '2024-10-17 10:05:30', 'http://udicast.com', '177.191.116.164', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(73, 2, '2024-10-17 15:09:45', 'http://udicast.com', '177.191.116.164', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(74, 2, '2024-10-18 10:01:04', 'http://udicast.com', '177.191.115.177', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(75, 2, '2024-10-21 10:46:10', 'http://udicast.com', '177.191.117.11', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(76, 2, '2024-10-22 10:09:54', 'http://udicast.com', '177.191.113.168', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(77, 2, '2024-10-23 08:46:20', 'http://udicast.com', '177.191.117.217', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(78, 2, '2024-10-24 11:35:31', 'http://udicast.com', '177.191.116.118', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(79, 2, '2024-10-24 19:14:21', 'http://udicast.com', '200.251.92.181', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(80, 2, '2024-10-28 09:55:53', 'http://udicast.com', '177.191.116.48', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(81, 2, '2024-11-01 10:21:57', 'http://udicast.com', '177.191.113.254', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(82, 2, '2024-11-01 11:17:12', 'http://udicast.com', '177.191.113.254', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(83, 2, '2024-11-08 09:44:26', 'http://udicast.com', '177.191.116.225', 'Chrome 129.0.0.0', 'Acessou o painel de controle.'),
	(84, 2, '2024-11-08 14:46:00', 'http://udicast.com', '177.191.116.225', 'Chrome 129.0.0.0', 'O streaming jÃ¡ esta ligado.'),
	(85, 2, '2024-11-11 14:56:17', 'http://udicast.com', '177.191.113.114', 'Chrome 130.0.0.0', 'Acessou o painel de controle.'),
	(86, 2, '2024-11-12 09:47:33', 'http://udicast.com', '177.191.112.230', 'Chrome 130.0.0.0', 'Acessou o painel de controle.'),
	(87, 2, '2024-11-12 16:33:26', 'http://udicast.com', '177.191.112.230', 'Chrome 130.0.0.0', 'Acessou o painel de controle.'),
	(88, 3, '2024-11-13 12:05:43', 'http://udicast.com', '189.37.81.81', 'Chrome 130.0.0.0', 'Acessou o painel de controle.'),
	(89, 2, '2024-11-18 10:15:44', 'http://udicast.com', '177.191.117.186', 'Chrome 130.0.0.0', 'Acessou o painel de controle.'),
	(90, 2, '2024-11-21 10:41:15', 'http://udicast.com', '177.191.113.4', 'Chrome 130.0.0.0', 'Acessou o painel de controle.'),
	(91, 2, '2024-11-25 08:55:06', 'http://udicast.com', '177.191.113.58', 'Chrome 130.0.0.0', 'Acessou o painel de controle.'),
	(92, 2, '2024-11-25 08:56:28', 'http://udicast.com', '177.191.113.58', 'Chrome 130.0.0.0', 'Acessou o painel de controle.'),
	(93, 2, '2024-11-26 08:54:56', 'http://udicast.com', '177.191.113.243', 'Chrome 130.0.0.0', 'Acessou o painel de controle.'),
	(94, 2, '2024-11-27 07:48:45', 'http://udicast.com', '177.191.116.22', 'Chrome 130.0.0.0', 'Acessou o painel de controle.'),
	(95, 2, '2024-11-27 08:18:58', 'http://udicast.com', '177.191.116.22', 'Chrome 130.0.0.0', 'Acessou o painel de controle.'),
	(96, 2, '2024-11-27 15:17:59', 'http://udicast.com', '177.191.116.22', 'Chrome 130.0.0.0', 'Saiu do painel de controle.'),
	(97, 2, '2024-11-27 15:18:25', 'http://udicast.com', '177.191.116.22', 'Chrome 130.0.0.0', 'Acessou o painel de controle.'),
	(98, 2, '2024-11-27 15:18:28', 'http://udicast.com', '179.126.21.176', 'Chrome 131.0.0.0', 'Acessou o painel de controle.'),
	(99, 2, '2024-11-27 16:39:11', 'http://udicast.com', '177.191.116.22', 'Chrome 130.0.0.0', 'Acessou o painel de controle.'),
	(100, 2, '2024-12-26 14:08:28', 'http://udicast.com', '177.191.112.54', 'Chrome 130.0.0.0', 'Acessou o painel de controle.'),
	(101, 2, '2024-12-26 14:11:16', 'http://udicast.com', '177.191.112.54', 'Chrome 130.0.0.0', 'Acessou o painel de controle.'),
	(102, 2, '2024-12-26 14:27:52', 'http://udicast.com', '177.191.112.54', 'Chrome 130.0.0.0', 'Saiu do painel de controle.'),
	(103, 2, '2024-12-26 14:28:07', 'http://udicast.com', '177.191.112.54', 'Chrome 130.0.0.0', 'Acessou o painel de controle.');
/*!40000 ALTER TABLE `logs_streamings` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.pastas
CREATE TABLE IF NOT EXISTS `pastas` (
  `Coluna 1` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Copiando dados para a tabela db_SamCast.pastas: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela db_SamCast.perfis_acesso
CREATE TABLE IF NOT EXISTS `perfis_acesso` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `permissoes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `data_criacao` datetime NOT NULL DEFAULT current_timestamp(),
  `data_atualizacao` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `criado_por` int(10) NOT NULL,
  PRIMARY KEY (`codigo`),
  KEY `idx_perfis_ativo` (`ativo`),
  KEY `idx_perfis_criado_por` (`criado_por`),
  CONSTRAINT `fk_perfis_criado_por` FOREIGN KEY (`criado_por`) REFERENCES `administradores` (`codigo`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela db_SamCast.perfis_acesso: ~3 rows (aproximadamente)
INSERT INTO `perfis_acesso` (`codigo`, `nome`, `descricao`, `permissoes`, `ativo`, `data_criacao`, `data_atualizacao`, `criado_por`) VALUES
	(4, 'Administrador Completo', 'Acesso total ao sistema exceto gerenciamento de perfis', '{"dashboard":{"visualizar":true},"revendas":{"visualizar":true,"criar":true,"editar":true,"excluir":true,"suspender":true,"ativar":true},"administradores":{"visualizar":true,"criar":true,"editar":true,"excluir":true,"alterar_status":true},"servidores":{"visualizar":true,"criar":true,"editar":true,"excluir":true,"migrar":true,"sincronizar":true,"inativar":true},"perfis":{"visualizar":true,"criar":true,"editar":true,"excluir":true},"logs":{"visualizar":true}}', 1, '2025-07-21 08:17:59', '2025-07-21 08:33:28', 3),
	(5, 'Suporte Técnico', 'Acesso para suporte técnico com permissões limitadas', '{"dashboard":{"visualizar":true},"revendas":{"visualizar":true,"criar":false,"editar":true,"excluir":false,"suspender":true,"ativar":true},"administradores":{"visualizar":false,"criar":false,"editar":false,"excluir":false,"alterar_status":false},"servidores":{"visualizar":true,"criar":false,"editar":false,"excluir":false,"migrar":false,"sincronizar":true,"inativar":false},"perfis":{"visualizar":false,"criar":false,"editar":false,"excluir":false},"logs":{"visualizar":true}}', 1, '2025-07-21 08:17:59', '2025-07-21 08:17:59', 3),
	(6, 'Operador', 'Acesso básico apenas para visualização e operações simples', '{"dashboard":{"visualizar":true},"revendas":{"visualizar":true,"criar":false,"editar":false,"excluir":false,"suspender":false,"ativar":false},"administradores":{"visualizar":false,"criar":false,"editar":false,"excluir":false,"alterar_status":false},"servidores":{"visualizar":false,"criar":false,"editar":false,"excluir":false,"migrar":false,"sincronizar":false,"inativar":false},"perfis":{"visualizar":false,"criar":false,"editar":false,"excluir":false},"logs":{"visualizar":false}}', 1, '2025-07-21 08:17:59', '2025-07-21 08:33:45', 3);

-- Copiando estrutura para tabela db_SamCast.planos_revenda
CREATE TABLE IF NOT EXISTS `planos_revenda` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` text DEFAULT NULL,
  `subrevendas` int(11) NOT NULL DEFAULT 0,
  `streamings` int(11) NOT NULL DEFAULT 1,
  `espectadores` int(11) NOT NULL DEFAULT 100,
  `bitrate` int(11) NOT NULL DEFAULT 2000,
  `espaco_ftp` int(11) NOT NULL DEFAULT 1000,
  `transmissao_srt` tinyint(1) NOT NULL DEFAULT 0,
  `preco` decimal(10,2) DEFAULT 0.00,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp(),
  `data_atualizacao` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `criado_por` int(11) DEFAULT NULL,
  PRIMARY KEY (`codigo`),
  KEY `idx_planos_revenda_ativo` (`ativo`),
  KEY `idx_planos_revenda_criado_por` (`criado_por`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- Copiando dados para a tabela db_SamCast.planos_revenda: ~3 rows (aproximadamente)
INSERT INTO `planos_revenda` (`codigo`, `nome`, `descricao`, `subrevendas`, `streamings`, `espectadores`, `bitrate`, `espaco_ftp`, `transmissao_srt`, `preco`, `ativo`, `data_criacao`, `data_atualizacao`, `criado_por`) VALUES
	(1, 'Básico', 'Plano básico para iniciantes', 0, 5, 100, 2000, 1000, 0, 29.90, 1, '2025-07-21 07:05:50', '2025-07-21 07:05:50', 1),
	(2, 'Intermediário', 'Plano intermediário com mais recursos', 2, 15, 500, 5000, 5000, 1, 79.90, 1, '2025-07-21 07:05:50', '2025-07-21 07:05:50', 1),
	(3, 'Avançado', 'Plano avançado para grandes operações', 10, 50, 2000, 10000, 20000, 1, 199.90, 1, '2025-07-21 07:05:50', '2025-07-21 07:05:50', 1);

-- Copiando estrutura para tabela db_SamCast.planos_streaming
CREATE TABLE IF NOT EXISTS `planos_streaming` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` text DEFAULT NULL,
  `espectadores` int(11) NOT NULL DEFAULT 100,
  `bitrate` int(11) NOT NULL DEFAULT 2000,
  `espaco_ftp` int(11) NOT NULL DEFAULT 1000,
  `preco` decimal(10,2) DEFAULT 0.00,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp(),
  `data_atualizacao` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `criado_por` int(11) DEFAULT NULL,
  PRIMARY KEY (`codigo`),
  KEY `idx_planos_streaming_ativo` (`ativo`),
  KEY `idx_planos_streaming_criado_por` (`criado_por`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- Copiando dados para a tabela db_SamCast.planos_streaming: ~3 rows (aproximadamente)
INSERT INTO `planos_streaming` (`codigo`, `nome`, `descricao`, `espectadores`, `bitrate`, `espaco_ftp`, `preco`, `ativo`, `data_criacao`, `data_atualizacao`, `criado_por`) VALUES
	(1, 'Stream Básico', 'Plano básico para streaming', 50, 1500, 500, 9.90, 1, '2025-07-21 07:05:50', '2025-07-21 07:05:50', 1),
	(2, 'Stream Pro', 'Plano profissional para streaming', 200, 3000, 2000, 19.90, 1, '2025-07-21 07:05:50', '2025-07-21 07:05:50', 1),
	(3, 'Stream Premium', 'Plano premium com máxima qualidade', 1000, 8000, 10000, 49.90, 1, '2025-07-21 07:05:50', '2025-07-21 07:05:50', 1);

-- Copiando estrutura para tabela db_SamCast.plataformas
CREATE TABLE IF NOT EXISTS `plataformas` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo_plataforma` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icone` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activity',
  `rtmp_base_url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `requer_stream_key` tinyint(1) NOT NULL DEFAULT 1,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `data_cadastro` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`codigo`),
  UNIQUE KEY `codigo_plataforma` (`codigo_plataforma`),
  KEY `idx_codigo_plataforma` (`codigo_plataforma`),
  KEY `idx_ativo` (`ativo`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela db_SamCast.plataformas: ~10 rows (aproximadamente)
INSERT INTO `plataformas` (`codigo`, `nome`, `codigo_plataforma`, `icone`, `rtmp_base_url`, `requer_stream_key`, `ativo`, `data_cadastro`) VALUES
	(1, 'YouTube', 'youtube', 'youtube', 'rtmp://a.rtmp.youtube.com/live2', 1, 1, '2025-07-07 18:43:08'),
	(2, 'Facebook', 'facebook', 'facebook', 'rtmps://live-api-s.facebook.com:443/rtmp', 1, 1, '2025-07-07 18:43:08'),
	(3, 'Instagram', 'instagram', 'instagram', 'rtmps://live-upload.instagram.com/rtmp', 1, 1, '2025-07-07 18:43:08'),
	(4, 'Twitch', 'twitch', 'twitch', 'rtmp://live.twitch.tv/app', 1, 1, '2025-07-07 18:43:08'),
	(5, 'TikTok', 'tiktok', 'video', 'rtmp://push.tiktokcdn.com/live', 1, 1, '2025-07-07 18:43:08'),
	(6, 'Vimeo', 'vimeo', 'video', 'rtmp://rtmp.vimeo.com/live', 1, 1, '2025-07-07 18:43:08'),
	(7, 'Periscope', 'periscope', 'radio', 'rtmp://publish.periscope.tv/live', 1, 1, '2025-07-07 18:43:08'),
	(8, 'Kwai', 'kwai', 'zap', 'rtmp://push.kwai.com/live', 1, 1, '2025-07-07 18:43:08'),
	(9, 'Steam', 'steam', 'activity', 'rtmp://ingest.broadcast.steamcontent.com/live', 1, 1, '2025-07-07 18:43:08'),
	(10, 'RTMP Próprio', 'rtmp', 'globe', 'rtmp://seu-servidor.com/live', 1, 1, '2025-07-07 18:43:08');

-- Copiando estrutura para tabela db_SamCast.playlists
CREATE TABLE IF NOT EXISTS `playlists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `codigo_stm` int(10) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `publica` tinyint(1) DEFAULT 0,
  `total_videos` int(10) DEFAULT 0,
  `duracao_total` int(10) DEFAULT 0,
  `data_criacao` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_codigo_stm` (`codigo_stm`),
  KEY `idx_publica` (`publica`),
  CONSTRAINT `fk_playlists_stm` FOREIGN KEY (`codigo_stm`) REFERENCES `revendas` (`codigo`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;

-- Copiando dados para a tabela db_SamCast.playlists: ~8 rows (aproximadamente)
INSERT INTO `playlists` (`id`, `nome`, `codigo_stm`, `descricao`, `publica`, `total_videos`, `duracao_total`, `data_criacao`) VALUES
	(1, 'A', NULL, NULL, 0, 0, 0, '2025-05-26 20:16:48'),
	(2, 'Teste', NULL, NULL, 0, 0, 0, '2025-05-26 20:18:29'),
	(4, 'TESTE', NULL, NULL, 0, 0, 0, '2025-05-26 22:08:42'),
	(5, 'TESTANDO', NULL, NULL, 0, 0, 0, '2025-05-26 22:47:36'),
	(7, 'a', NULL, NULL, 0, 0, 0, '2025-05-26 23:45:55'),
	(8, 'AAAAA', NULL, NULL, 0, 0, 0, '2025-05-27 20:45:00'),
	(9, 'TESTE', 3, NULL, 0, 0, 0, '2025-07-07 21:04:25'),
	(10, 'Videos', 3, NULL, 0, 1, 9, '2025-07-07 21:45:38');

-- Copiando estrutura para tabela db_SamCast.playlists_agendamentos
CREATE TABLE IF NOT EXISTS `playlists_agendamentos` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_stm` int(10) NOT NULL,
  `codigo_playlist` int(10) NOT NULL,
  `servidor_relay` varchar(255) NOT NULL,
  `frequencia` int(1) NOT NULL DEFAULT 1,
  `data` date NOT NULL,
  `hora` char(2) NOT NULL,
  `minuto` char(2) NOT NULL,
  `dias` varchar(50) NOT NULL,
  `tipo` varchar(50) NOT NULL DEFAULT 'playlist',
  `shuffle` char(3) NOT NULL DEFAULT 'nao',
  `finalizacao` char(20) NOT NULL DEFAULT 'repetir',
  `codigo_playlist_finalizacao` int(10) NOT NULL DEFAULT 0,
  `inicio` int(1) NOT NULL DEFAULT 2,
  PRIMARY KEY (`codigo`),
  KEY `indice_data` (`data`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.playlists_agendamentos: 0 rows
/*!40000 ALTER TABLE `playlists_agendamentos` DISABLE KEYS */;
/*!40000 ALTER TABLE `playlists_agendamentos` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.playlists_agendamentos_logs
CREATE TABLE IF NOT EXISTS `playlists_agendamentos_logs` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_agendamento` int(10) NOT NULL DEFAULT 0,
  `codigo_stm` int(10) NOT NULL DEFAULT 0,
  `data` datetime DEFAULT NULL,
  `playlist` varchar(255) COLLATE latin1_general_ci DEFAULT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Copiando dados para a tabela db_SamCast.playlists_agendamentos_logs: 0 rows
/*!40000 ALTER TABLE `playlists_agendamentos_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `playlists_agendamentos_logs` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.playlists_videos
CREATE TABLE IF NOT EXISTS `playlists_videos` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_playlist` int(10) NOT NULL,
  `path_video` varchar(255) NOT NULL,
  `video` varchar(255) NOT NULL,
  `width` int(10) NOT NULL,
  `height` int(10) NOT NULL,
  `bitrate` int(10) NOT NULL,
  `duracao` char(10) NOT NULL,
  `duracao_segundos` int(11) NOT NULL,
  `tipo` varchar(255) NOT NULL DEFAULT 'video',
  `ordem` int(10) NOT NULL,
  PRIMARY KEY (`codigo`),
  KEY `idx_playlist_ordem` (`codigo_playlist`,`ordem`),
  KEY `idx_tipo` (`tipo`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.playlists_videos: 5 rows
/*!40000 ALTER TABLE `playlists_videos` DISABLE KEYS */;
INSERT INTO `playlists_videos` (`codigo`, `codigo_playlist`, `path_video`, `video`, `width`, `height`, `bitrate`, `duracao`, `duracao_segundos`, `tipo`, `ordem`) VALUES
	(1, 1, 'demo1.mp4', 'demo1.mp4', 1280, 720, 1029, '00:15:19', 919, 'video', 0),
	(2, 2, 'video1.mp4', 'video1.mp4', 854, 480, 627, '00:03:18', 198, 'video', 0),
	(3, 2, 'video2.mp4', 'video2.mp4', 862, 480, 568, '00:03:38', 218, 'video', 1),
	(4, 0, '/PEDRO/1/1751899311305_Amigos_-_Discord_2025-04-29_22-30-36.mp4', 'Amigos - Discord 2025-04-29 22-30-36.mp4', 1920, 1080, 2500, '00:00:00', 9, 'video', 0),
	(5, 10, '/PEDRO/1/1751899311305_Amigos_-_Discord_2025-04-29_22-30-36.mp4', 'Amigos - Discord 2025-04-29 22-30-36.mp4', 1920, 1080, 2500, '00:00:00', 9, 'video', 0);
/*!40000 ALTER TABLE `playlists_videos` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.relay_agendamentos
CREATE TABLE IF NOT EXISTS `relay_agendamentos` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_stm` int(10) NOT NULL,
  `servidor_relay` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `frequencia` int(1) NOT NULL DEFAULT 1,
  `data` date NOT NULL,
  `hora` char(2) COLLATE latin1_general_ci NOT NULL,
  `minuto` char(2) COLLATE latin1_general_ci NOT NULL,
  `dias` varchar(50) COLLATE latin1_general_ci NOT NULL,
  `status` int(1) NOT NULL DEFAULT 0,
  `duracao` char(6) COLLATE latin1_general_ci NOT NULL,
  `log_data_inicio` datetime NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Copiando dados para a tabela db_SamCast.relay_agendamentos: 0 rows
/*!40000 ALTER TABLE `relay_agendamentos` DISABLE KEYS */;
/*!40000 ALTER TABLE `relay_agendamentos` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.relay_agendamentos_logs
CREATE TABLE IF NOT EXISTS `relay_agendamentos_logs` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_agendamento` int(10) NOT NULL,
  `codigo_stm` int(10) NOT NULL,
  `data` datetime NOT NULL,
  `servidor_relay` varchar(255) COLLATE latin1_general_ci NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Copiando dados para a tabela db_SamCast.relay_agendamentos_logs: 0 rows
/*!40000 ALTER TABLE `relay_agendamentos_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `relay_agendamentos_logs` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.revendas
CREATE TABLE IF NOT EXISTS `revendas` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_revenda` int(10) NOT NULL,
  `id` char(6) CHARACTER SET latin1 NOT NULL,
  `nome` varchar(255) CHARACTER SET latin1 NOT NULL,
  `email` varchar(255) CHARACTER SET latin1 NOT NULL,
  `avatar` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `senha` varchar(255) CHARACTER SET latin1 NOT NULL,
  `streamings` int(10) NOT NULL,
  `espectadores` int(10) NOT NULL,
  `bitrate` int(10) NOT NULL,
  `espaco` int(10) NOT NULL,
  `subrevendas` int(10) NOT NULL DEFAULT 0,
  `chave_api` longtext CHARACTER SET latin1 NOT NULL,
  `status` int(1) NOT NULL DEFAULT 1,
  `url_suporte` text CHARACTER SET latin1 DEFAULT NULL,
  `data_cadastro` datetime NOT NULL,
  `dominio_padrao` varchar(255) CHARACTER SET latin1 NOT NULL,
  `stm_exibir_tutoriais` char(3) CHARACTER SET latin1 NOT NULL DEFAULT 'sim',
  `url_tutoriais` varchar(255) CHARACTER SET latin1 NOT NULL DEFAULT 'http://',
  `stm_exibir_downloads` char(3) CHARACTER SET latin1 NOT NULL DEFAULT 'sim',
  `stm_exibir_mini_site` char(3) CHARACTER SET latin1 NOT NULL DEFAULT 'nao',
  `stm_exibir_app_android_painel` char(3) CHARACTER SET latin1 NOT NULL DEFAULT 'sim',
  `idioma_painel` char(10) CHARACTER SET latin1 NOT NULL DEFAULT 'pt-br',
  `tipo` int(1) NOT NULL DEFAULT 1,
  `ultimo_acesso_data` datetime NOT NULL,
  `ultimo_acesso_ip` varchar(255) CHARACTER SET latin1 NOT NULL DEFAULT '000.000.000.000',
  `stm_exibir_app_android` char(3) CHARACTER SET latin1 NOT NULL DEFAULT 'sim',
  `srt_status` char(3) CHARACTER SET latin1 NOT NULL DEFAULT 'nao',
  `api_token` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `refresh_token` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `configuracoes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `admin_criador` int(10) DEFAULT NULL COMMENT 'Admin que criou a conta',
  `codigo_wowza_servidor` int(10) DEFAULT NULL,
  `data_expiracao` date DEFAULT NULL COMMENT 'Data de expiração da conta',
  `status_detalhado` enum('ativo','suspenso','expirado','cancelado','teste') COLLATE utf8mb4_unicode_ci DEFAULT 'ativo',
  `observacoes_admin` text COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Observações administrativas',
  `limite_uploads_diario` int(10) DEFAULT 100 COMMENT 'Limite de uploads por dia',
  `espectadores_ilimitado` tinyint(1) DEFAULT 0 COMMENT 'Se tem espectadores ilimitados',
  `bitrate_maximo` int(10) DEFAULT 5000 COMMENT 'Bitrate máximo permitido',
  `total_transmissoes` int(10) DEFAULT 0 COMMENT 'Total de transmissões realizadas',
  `ultima_transmissao` datetime DEFAULT NULL COMMENT 'Data da última transmissão',
  `espaco_usado_mb` int(10) DEFAULT 0 COMMENT 'Espaço usado em MB',
  `data_ultima_atualizacao` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `plano_id` int(11) DEFAULT NULL,
  `streamings_usadas` int(11) DEFAULT 0,
  `espectadores_usados` int(11) DEFAULT 0,
  `bitrate_usado` int(11) DEFAULT 0,
  `espaco_usado` int(11) DEFAULT 0,
  `subrevendas_usadas` int(11) DEFAULT 0,
  PRIMARY KEY (`codigo`),
  KEY `idx_revendas_status_detalhado` (`status_detalhado`),
  KEY `idx_revendas_data_expiracao` (`data_expiracao`),
  KEY `idx_revendas_admin_criador` (`admin_criador`),
  KEY `idx_revendas_ultima_transmissao` (`ultima_transmissao`),
  KEY `idx_revendas_wowza_servidor` (`codigo_wowza_servidor`),
  KEY `idx_revendas_plano_id` (`plano_id`),
  CONSTRAINT `fk_revendas_admin_criador` FOREIGN KEY (`admin_criador`) REFERENCES `administradores` (`codigo`) ON DELETE SET NULL,
  CONSTRAINT `fk_revendas_wowza_servidor` FOREIGN KEY (`codigo_wowza_servidor`) REFERENCES `wowza_servers` (`codigo`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela db_SamCast.revendas: ~5 rows (aproximadamente)
INSERT INTO `revendas` (`codigo`, `codigo_revenda`, `id`, `nome`, `email`, `avatar`, `telefone`, `senha`, `streamings`, `espectadores`, `bitrate`, `espaco`, `subrevendas`, `chave_api`, `status`, `url_suporte`, `data_cadastro`, `dominio_padrao`, `stm_exibir_tutoriais`, `url_tutoriais`, `stm_exibir_downloads`, `stm_exibir_mini_site`, `stm_exibir_app_android_painel`, `idioma_painel`, `tipo`, `ultimo_acesso_data`, `ultimo_acesso_ip`, `stm_exibir_app_android`, `srt_status`, `api_token`, `refresh_token`, `configuracoes`, `admin_criador`, `codigo_wowza_servidor`, `data_expiracao`, `status_detalhado`, `observacoes_admin`, `limite_uploads_diario`, `espectadores_ilimitado`, `bitrate_maximo`, `total_transmissoes`, `ultima_transmissao`, `espaco_usado_mb`, `data_ultima_atualizacao`, `plano_id`, `streamings_usadas`, `espectadores_usados`, `bitrate_usado`, `espaco_usado`, `subrevendas_usadas`) VALUES
	(1, 0, 'bafa01', 'wcore', 'hasky159@gmail.com', NULL, NULL, '$2b$10$hqDdZ84du6EKbExyMdntoe9u9P3b4vUqaZPQVoZ88yHk7WGlqnPli', 5, 1000, 2000, 50000, 0, 'Wm1sa1pXeGpibTluZFdWcGNtRkFaMjFoYVd3dVkyOXQrWg==', 1, NULL, '2024-09-19 00:02:35', '', 'sim', 'http://', 'sim', 'nao', 'sim', 'pt-br', 1, '2024-10-10 09:32:40', '177.191.117.145', 'sim', 'sim', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6Im90YWdvbWVzQGhvdG1haWwuY29tIiwicm9sZSI6ImFkbWluaXN0cmF0b3IiLCJuYmYiOjE3Mzg3MTE2OTMsImV4cCI6MTczOTQzMTY5MywiaWF0IjoxNzM4NzExNjkzfQ.p-CxXT1c-hn6i3t2R7TP-0FPskjhN7U3Z3Kn_GwRpHk', NULL, NULL, NULL, 1, NULL, 'ativo', NULL, 100, 0, 5000, 0, NULL, 0, '2025-07-21 08:18:31', NULL, 0, 0, 0, 0, 0),
	(2, 0, 'f14834', 'samhost', 'radiosonlinefull@gmail.com', NULL, NULL, '$2a$12$b0yhJSY6AWCax4QaOOvQoOpQYx483E.tGgm8KVOy8DP2wnOBtNiJG', 30, 5000, 2500, 10000, 0, 'Y21Ga2FXOXpiMjVzYVc1bFpuVnNiRUJuYldGcGJDNWpiMjA9K1o=', 1, NULL, '2024-11-13 11:41:32', '', 'sim', 'http://', 'sim', 'nao', 'sim', 'pt-br', 1, '2024-11-13 11:42:03', '216.238.112.124', 'sim', 'nao', NULL, NULL, NULL, NULL, 1, NULL, 'ativo', NULL, 100, 0, 5000, 0, NULL, 0, '2025-07-21 08:18:31', NULL, 0, 0, 0, 0, 0),
	(3, 0, 'HIUTXD', 'PEDRO FELIPE NOGUEIRA DE MEDEIROS', 'PEDRO@gmail.com', NULL, NULL, '$2b$10$QdgoVeaeuxxe2en.aIucBO/wTKj3MIP9QOtze86xEwSd/yAVI5La6', 1, 100, 2500, 1, 0, '', 1, NULL, '2025-07-07 17:41:13', '', 'sim', 'http://', 'sim', 'nao', 'sim', 'pt-br', 1, '2025-07-17 00:23:38', '::ffff:127.0.0.1', 'sim', 'nao', NULL, NULL, NULL, NULL, 1, NULL, 'ativo', NULL, 100, 0, 5000, 0, NULL, 0, '2025-07-21 08:18:31', NULL, 0, 0, 0, 0, 0),
	(4, 0, 'N2S8VO', 'Fidel Nogueira', 'fidelcnogueira@gmail.com', NULL, '', '$2a$10$C92uLJulslhfZH1eba36Ku1YwG6pUIDM9/jkEvNrumIKkBblbg49a', 1, 100, 2000, 1000, 0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ik4yUzhWTyIsImVtYWlsIjoiZmlkZWxjbm9ndWVpcmFAZ21haWwuY29tIiwiaWF0IjoxNzUyNzc4NTc4fQ.-gVD4emTZ3xhZV_4jQuZmQ9QN5JSzJ_-xmdLUSu8Wq8', 1, '', '2025-07-17 21:56:19', '', 'sim', 'http://', 'sim', 'nao', 'sim', 'pt-br', 1, '2025-07-17 21:56:19', '0.0.0.0', 'sim', 'nao', NULL, NULL, NULL, 3, 1, NULL, 'suspenso', '', 100, 1, 5000, 0, NULL, 0, '2025-07-21 08:18:31', NULL, 0, 0, 0, 0, 0),
	(5, 0, 'TAQJ7N', 'Vithor', 'vithorevaristo@gmail.com', NULL, '', '$2a$10$zzGJ/hKQLngALeSQZpb/nencg.MW.XB5bjLbgF5lA3pn2g5NWsHL.', 1, 100, 2000, 1000, 0, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlRBUUo3TiIsImVtYWlsIjoidml0aG9yZXZhcmlzdG9AZ21haWwuY29tIiwiaWF0IjoxNzUyNzc5MTk2fQ.RLsqVa-xg94PZ3P5QMLsXhpc0DgHpA5X79BIyJrvofo', 1, '', '2025-07-17 22:06:37', 'https://streaming.exemplo.com', 'sim', 'http://', 'sim', 'nao', 'sim', 'pt-br', 1, '2025-07-17 22:06:37', '0.0.0.0', 'sim', 'nao', NULL, NULL, NULL, 3, 1, NULL, 'ativo', '', 100, 1, 5000, 0, NULL, 0, '2025-07-21 08:18:31', NULL, 0, 0, 0, 0, 0);

-- Copiando estrutura para tabela db_SamCast.revendas_planos
CREATE TABLE IF NOT EXISTS `revendas_planos` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_revenda` int(10) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `espectadores` int(10) NOT NULL,
  `bitrate` int(10) NOT NULL,
  `espaco_ftp` int(10) NOT NULL,
  `ipcameras` int(10) NOT NULL,
  `subrevendas` int(10) NOT NULL,
  `streamings` int(10) NOT NULL DEFAULT 0,
  `tipo` char(10) NOT NULL DEFAULT 'streaming',
  `aplicacao` varchar(10) NOT NULL DEFAULT 'live',
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.revendas_planos: 0 rows
/*!40000 ALTER TABLE `revendas_planos` DISABLE KEYS */;
/*!40000 ALTER TABLE `revendas_planos` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.screen_size
CREATE TABLE IF NOT EXISTS `screen_size` (
  `codigo` int(11) NOT NULL AUTO_INCREMENT,
  `width` varchar(255) NOT NULL,
  `height` varchar(255) NOT NULL,
  `data` datetime NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.screen_size: 0 rows
/*!40000 ALTER TABLE `screen_size` DISABLE KEYS */;
/*!40000 ALTER TABLE `screen_size` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.servidores
CREATE TABLE IF NOT EXISTS `servidores` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL DEFAULT 'Stm',
  `ip` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `porta_ssh` int(6) NOT NULL DEFAULT 6985,
  `status` char(3) NOT NULL DEFAULT 'on',
  `limite_streamings` int(10) NOT NULL DEFAULT 150,
  `load` float NOT NULL,
  `trafego` varchar(255) NOT NULL,
  `trafego_out` varchar(255) NOT NULL,
  `ordem` int(10) NOT NULL,
  `mensagem_manutencao` text NOT NULL,
  `grafico_trafego` text NOT NULL,
  `exibir` char(3) NOT NULL DEFAULT 'sim',
  `path_home` varchar(255) NOT NULL DEFAULT '/home',
  `instalacao_status` int(1) NOT NULL DEFAULT 0,
  `porta_ssh_atual` int(6) NOT NULL DEFAULT 22,
  `instalacao_porta_ssh_atual` int(6) NOT NULL DEFAULT 22,
  `tipo` varchar(255) NOT NULL DEFAULT 'streaming',
  `instalacao_porta_ssh` int(6) NOT NULL,
  `nome_principal` varchar(255) NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.servidores: 1 rows
/*!40000 ALTER TABLE `servidores` DISABLE KEYS */;
INSERT INTO `servidores` (`codigo`, `nome`, `ip`, `senha`, `porta_ssh`, `status`, `limite_streamings`, `load`, `trafego`, `trafego_out`, `ordem`, `mensagem_manutencao`, `grafico_trafego`, `exibir`, `path_home`, `instalacao_status`, `porta_ssh_atual`, `instalacao_porta_ssh_atual`, `tipo`, `instalacao_porta_ssh`, `nome_principal`) VALUES
	(1, 'stmv1', '51.222.156.223', 'VlcxMGVtVnJPVVpVYldoT1lrVTBlRlZzVW1GalYxSnlZMFpzWVZZeFJURlVha1poVkcxS2JsQlVNRDA9K1I=', 6985, 'on', 200, 0.05, '', '1.66 kb/s\n', 0, '', '', '', '/home', 0, 22, 22, 'streaming', 0, 'stmv1');
/*!40000 ALTER TABLE `servidores` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.servidores_migracao
CREATE TABLE IF NOT EXISTS `servidores_migracao` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_servidor` int(10) NOT NULL,
  `ip` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `senha` varchar(255) COLLATE latin1_general_ci NOT NULL,
  `porta_ssh` int(10) NOT NULL,
  `data_inicio` datetime NOT NULL,
  `status` int(1) NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

-- Copiando dados para a tabela db_SamCast.servidores_migracao: 0 rows
/*!40000 ALTER TABLE `servidores_migracao` DISABLE KEYS */;
/*!40000 ALTER TABLE `servidores_migracao` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.streamings
CREATE TABLE IF NOT EXISTS `streamings` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_cliente` int(10) NOT NULL,
  `codigo_servidor` int(10) NOT NULL,
  `login` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `senha_transmissao` varchar(255) NOT NULL,
  `autenticar_live` char(3) NOT NULL DEFAULT 'sim',
  `espectadores` int(10) NOT NULL,
  `bitrate` int(10) NOT NULL,
  `espaco` int(10) NOT NULL,
  `espaco_usado` int(10) NOT NULL,
  `ipcameras` int(10) NOT NULL DEFAULT 0,
  `ftp_dir` varchar(255) NOT NULL,
  `identificacao` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `timezone` varchar(255) NOT NULL DEFAULT 'America/Sao_Paulo',
  `formato_data` char(11) NOT NULL DEFAULT 'd/m/Y H:i:s',
  `descricao` varchar(255) NOT NULL,
  `idioma_painel` char(10) NOT NULL DEFAULT 'pt-br',
  `pagina_inicial` varchar(255) NOT NULL DEFAULT '/informacoes',
  `exibir_atalhos` char(3) NOT NULL DEFAULT 'nao',
  `player_autoplay` char(5) NOT NULL DEFAULT 'true',
  `player_volume_inicial` char(3) NOT NULL DEFAULT '1.0',
  `permitir_alterar_senha` char(3) NOT NULL DEFAULT 'sim',
  `data_cadastro` datetime NOT NULL,
  `aplicacao` char(10) DEFAULT 'live',
  `player_titulo` varchar(255) NOT NULL,
  `player_descricao` varchar(255) NOT NULL,
  `status_gravando` char(3) NOT NULL DEFAULT 'nao',
  `gravador_arquivo` varchar(255) NOT NULL,
  `gravador_data_inicio` datetime NOT NULL,
  `exibir_app_android` char(3) NOT NULL DEFAULT 'sim',
  `status` int(1) NOT NULL DEFAULT 1,
  `transcoder` char(3) NOT NULL DEFAULT 'nao',
  `transcoder_qualidades` varchar(255) NOT NULL DEFAULT '720p|360p|240p|160p|h263',
  `aparencia_exibir_stats_espectadores` char(3) NOT NULL DEFAULT 'sim',
  `aparencia_exibir_stats_ftp` char(3) NOT NULL DEFAULT 'sim',
  `ultima_playlist` int(10) NOT NULL,
  `live_youtube` char(3) NOT NULL DEFAULT 'sim',
  `app_nome` varchar(255) NOT NULL,
  `app_email` varchar(255) NOT NULL,
  `app_whatsapp` varchar(255) NOT NULL,
  `app_url_logo` varchar(255) NOT NULL,
  `app_url_icone` varchar(255) NOT NULL,
  `app_url_background` varchar(255) NOT NULL,
  `app_url_facebook` varchar(255) NOT NULL,
  `app_url_instagram` varchar(255) NOT NULL,
  `app_url_twitter` varchar(255) NOT NULL,
  `app_url_site` varchar(255) NOT NULL,
  `app_url_chat` varchar(255) NOT NULL,
  `app_cor_texto` char(7) NOT NULL DEFAULT '#FFFFFF',
  `app_cor_menu_claro` char(7) NOT NULL DEFAULT '#7386d5',
  `app_cor_menu_escuro` char(7) NOT NULL DEFAULT '#6d7fcc',
  `app_win_nome` varchar(255) NOT NULL,
  `app_win_email` varchar(255) NOT NULL,
  `app_win_whatsapp` varchar(255) NOT NULL,
  `app_win_url_logo` varchar(255) NOT NULL,
  `app_win_url_icone` varchar(255) NOT NULL,
  `app_win_url_background` varchar(255) NOT NULL,
  `app_win_url_facebook` varchar(255) NOT NULL,
  `app_win_url_instagram` varchar(255) NOT NULL,
  `app_win_url_twitter` varchar(255) NOT NULL,
  `app_win_url_site` varchar(255) NOT NULL,
  `app_win_url_chat` varchar(255) NOT NULL,
  `app_win_cor_texto` char(7) NOT NULL DEFAULT '#FFFFFF',
  `app_win_cor_menu_claro` char(7) NOT NULL DEFAULT '#7386d5',
  `app_win_cor_menu_escuro` char(7) NOT NULL DEFAULT '#6d7fcc',
  `app_win_url_youtube` varchar(255) NOT NULL,
  `app_win_text_prog` longtext NOT NULL,
  `app_win_text_hist` longtext NOT NULL,
  `app_tela_inicial` int(1) NOT NULL DEFAULT 1,
  `watermark_posicao` varchar(255) NOT NULL,
  `geoip_ativar` char(3) NOT NULL DEFAULT 'nao',
  `geoip_paises_bloqueados` text NOT NULL,
  `relay_status` char(3) NOT NULL DEFAULT 'nao',
  `relay_url` varchar(255) NOT NULL,
  `webrtc_chave` varchar(255) NOT NULL,
  `srt_status` char(3) NOT NULL DEFAULT 'nao',
  `srt_porta` int(10) NOT NULL DEFAULT 0,
  `app_certificado` varchar(255) NOT NULL DEFAULT 'padrao',
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.streamings: 3 rows
/*!40000 ALTER TABLE `streamings` DISABLE KEYS */;
INSERT INTO `streamings` (`codigo`, `codigo_cliente`, `codigo_servidor`, `login`, `senha`, `senha_transmissao`, `autenticar_live`, `espectadores`, `bitrate`, `espaco`, `espaco_usado`, `ipcameras`, `ftp_dir`, `identificacao`, `email`, `timezone`, `formato_data`, `descricao`, `idioma_painel`, `pagina_inicial`, `exibir_atalhos`, `player_autoplay`, `player_volume_inicial`, `permitir_alterar_senha`, `data_cadastro`, `aplicacao`, `player_titulo`, `player_descricao`, `status_gravando`, `gravador_arquivo`, `gravador_data_inicio`, `exibir_app_android`, `status`, `transcoder`, `transcoder_qualidades`, `aparencia_exibir_stats_espectadores`, `aparencia_exibir_stats_ftp`, `ultima_playlist`, `live_youtube`, `app_nome`, `app_email`, `app_whatsapp`, `app_url_logo`, `app_url_icone`, `app_url_background`, `app_url_facebook`, `app_url_instagram`, `app_url_twitter`, `app_url_site`, `app_url_chat`, `app_cor_texto`, `app_cor_menu_claro`, `app_cor_menu_escuro`, `app_win_nome`, `app_win_email`, `app_win_whatsapp`, `app_win_url_logo`, `app_win_url_icone`, `app_win_url_background`, `app_win_url_facebook`, `app_win_url_instagram`, `app_win_url_twitter`, `app_win_url_site`, `app_win_url_chat`, `app_win_cor_texto`, `app_win_cor_menu_claro`, `app_win_cor_menu_escuro`, `app_win_url_youtube`, `app_win_text_prog`, `app_win_text_hist`, `app_tela_inicial`, `watermark_posicao`, `geoip_ativar`, `geoip_paises_bloqueados`, `relay_status`, `relay_url`, `webrtc_chave`, `srt_status`, `srt_porta`, `app_certificado`) VALUES
	(1, 1, 1, 'demo', 'demo_demo', 'demo_demo', 'sim', 100, 2048, 1000, 113, 0, '/home/streaming/demo', 'Demo', '', 'America/Sao_Paulo', 'd/m/Y H:i:s', '', 'pt-br', '/informacoes', 'nao', 'true', '1.0', 'sim', '2024-09-18 23:58:01', 'tvstation', '', '', 'nao', '', '0000-00-00 00:00:00', 'sim', 1, 'nao', '720p|360p|240p|160p|h263', 'sim', 'sim', 0, 'sim', 'Teste Final CÃ©sar', '', '', '/app/logo-demo.png', '/app/icone-demo.jpg', '/app/background-demo.jpg', '', '', '', '', '', '#FFFFFF', '#7386d5', '#6d7fcc', '', '', '', '', '', '', '', '', '', '', '', '#FFFFFF', '#7386d5', '#6d7fcc', '', '', '', 1, '', 'nao', '', 'nao', '', '', 'nao', 39373, 'padrao'),
	(2, 1, 1, 'wcore', 'wcore2020', 'testteste', 'sim', 0, 2000, 10000, 35, 0, '/home/streaming/wcore', 'Wcore Testes', 'samhoststreaming@gmail.com', 'America/Sao_Paulo', 'd/m/Y H:i:s', '', 'pt-br', '/informacoes', 'nao', 'true', '1.0', 'sim', '2024-09-19 00:07:32', 'tvstation', 'teste', 'teste', 'nao', '', '2024-09-19 00:07:32', 'sim', 1, 'nao', '720p|360p|240p|160p|h263', 'sim', 'sim', 0, 'sim', 'app', '', '', '/app/logo-wcore.png', '/app/icone-wcore.jpg', '/app/background-wcore.jpg', '', '', '', '', '', '#fcfcfc', '#0231ed', '#6d7fcc', '', '', '', '', '', '', '', '', '', '', '', '#FFFFFF', '#7386d5', '#6d7fcc', '', '', '', 1, '', 'sim', 'AX,DZ,PT', 'nao', '', '', 'nao', 20900, 'padrao'),
	(3, 2, 1, 'teste', 'teste@2020', 'teste@2020', 'sim', 5, 2500, 5000, 8, 0, '/home/streaming/teste', 'Teste sam', 'casadostream@gmail.com', 'America/Sao_Paulo', 'd/m/Y H:i:s', '', 'pt-br', '/informacoes', 'nao', 'true', '1.0', 'sim', '2024-11-13 11:42:49', 'tvstation', '', '', 'nao', '', '0000-00-00 00:00:00', 'sim', 1, 'nao', '720p|360p|240p|160p|h263', 'sim', 'sim', 0, 'sim', '', '', '', '', '', '', '', '', '', '', '', '#FFFFFF', '#7386d5', '#6d7fcc', '', '', '', '', '', '', '', '', '', '', '', '#FFFFFF', '#7386d5', '#6d7fcc', '', '', '', 1, '', 'nao', '', 'nao', '', '', 'nao', 45672, 'padrao');
/*!40000 ALTER TABLE `streamings` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.transmission_settings
CREATE TABLE IF NOT EXISTS `transmission_settings` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_stm` int(10) NOT NULL,
  `nome` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo_logo` int(10) DEFAULT NULL,
  `logo_posicao` enum('top-left','top-right','bottom-left','bottom-right','center') COLLATE utf8mb4_unicode_ci DEFAULT 'top-right',
  `logo_opacidade` int(3) DEFAULT 80,
  `logo_tamanho` enum('small','medium','large') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `logo_margem_x` int(5) DEFAULT 20,
  `logo_margem_y` int(5) DEFAULT 20,
  `embaralhar_videos` tinyint(1) DEFAULT 0,
  `repetir_playlist` tinyint(1) DEFAULT 1,
  `transicao_videos` enum('fade','cut','slide') COLLATE utf8mb4_unicode_ci DEFAULT 'fade',
  `resolucao` enum('720p','1080p','1440p','4k') COLLATE utf8mb4_unicode_ci DEFAULT '1080p',
  `fps` int(3) DEFAULT 30,
  `bitrate` int(6) DEFAULT 2500,
  `titulo_padrao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descricao_padrao` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_criacao` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`codigo`),
  KEY `idx_codigo_stm` (`codigo_stm`),
  KEY `idx_codigo_logo` (`codigo_logo`),
  CONSTRAINT `transmission_settings_ibfk_1` FOREIGN KEY (`codigo_stm`) REFERENCES `revendas` (`codigo`) ON DELETE CASCADE,
  CONSTRAINT `transmission_settings_ibfk_2` FOREIGN KEY (`codigo_logo`) REFERENCES `logos` (`codigo`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela db_SamCast.transmission_settings: ~1 rows (aproximadamente)
INSERT INTO `transmission_settings` (`codigo`, `codigo_stm`, `nome`, `codigo_logo`, `logo_posicao`, `logo_opacidade`, `logo_tamanho`, `logo_margem_x`, `logo_margem_y`, `embaralhar_videos`, `repetir_playlist`, `transicao_videos`, `resolucao`, `fps`, `bitrate`, `titulo_padrao`, `descricao_padrao`, `data_criacao`) VALUES
	(1, 3, 'Nova Configuração', 1, 'top-right', 12, 'small', 20, 20, 0, 1, 'fade', '1080p', 30, 2500, '', '', '2025-07-07 21:49:19');

-- Copiando estrutura para tabela db_SamCast.transmissoes
CREATE TABLE IF NOT EXISTS `transmissoes` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_stm` int(10) NOT NULL,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codigo_playlist` int(10) DEFAULT NULL,
  `wowza_stream_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('ativa','finalizada','erro') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ativa',
  `data_inicio` datetime NOT NULL DEFAULT current_timestamp(),
  `data_fim` datetime DEFAULT NULL,
  `viewers_pico` int(10) DEFAULT 0,
  `duracao_segundos` int(10) DEFAULT 0,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`codigo`),
  KEY `idx_codigo_stm` (`codigo_stm`),
  KEY `idx_status` (`status`),
  KEY `idx_data_inicio` (`data_inicio`),
  CONSTRAINT `transmissoes_ibfk_1` FOREIGN KEY (`codigo_stm`) REFERENCES `revendas` (`codigo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela db_SamCast.transmissoes: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela db_SamCast.transmissoes_plataformas
CREATE TABLE IF NOT EXISTS `transmissoes_plataformas` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `transmissao_id` int(10) NOT NULL,
  `user_platform_id` int(10) NOT NULL,
  `status` enum('conectando','ativa','erro','desconectada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'conectando',
  `data_inicio` datetime NOT NULL DEFAULT current_timestamp(),
  `data_fim` datetime DEFAULT NULL,
  `erro_detalhes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`codigo`),
  KEY `idx_transmissao_id` (`transmissao_id`),
  KEY `idx_user_platform_id` (`user_platform_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `transmissoes_plataformas_ibfk_1` FOREIGN KEY (`transmissao_id`) REFERENCES `transmissoes` (`codigo`) ON DELETE CASCADE,
  CONSTRAINT `transmissoes_plataformas_ibfk_2` FOREIGN KEY (`user_platform_id`) REFERENCES `user_platforms` (`codigo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela db_SamCast.transmissoes_plataformas: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela db_SamCast.tutoriais
CREATE TABLE IF NOT EXISTS `tutoriais` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `data` date NOT NULL,
  `vizualizacoes` int(10) NOT NULL,
  `tutorial` longtext NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- Copiando dados para a tabela db_SamCast.tutoriais: 0 rows
/*!40000 ALTER TABLE `tutoriais` DISABLE KEYS */;
/*!40000 ALTER TABLE `tutoriais` ENABLE KEYS */;

-- Copiando estrutura para tabela db_SamCast.user_platforms
CREATE TABLE IF NOT EXISTS `user_platforms` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_stm` int(10) NOT NULL,
  `platform_id` int(10) NOT NULL,
  `stream_key` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rtmp_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `titulo_padrao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descricao_padrao` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `data_cadastro` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`codigo`),
  UNIQUE KEY `unique_user_platform` (`codigo_stm`,`platform_id`),
  KEY `idx_codigo_stm` (`codigo_stm`),
  KEY `idx_platform_id` (`platform_id`),
  CONSTRAINT `user_platforms_ibfk_1` FOREIGN KEY (`codigo_stm`) REFERENCES `revendas` (`codigo`) ON DELETE CASCADE,
  CONSTRAINT `user_platforms_ibfk_2` FOREIGN KEY (`platform_id`) REFERENCES `plataformas` (`codigo`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela db_SamCast.user_platforms: ~1 rows (aproximadamente)
INSERT INTO `user_platforms` (`codigo`, `codigo_stm`, `platform_id`, `stream_key`, `rtmp_url`, `titulo_padrao`, `descricao_padrao`, `ativo`, `data_cadastro`) VALUES
	(1, 3, 1, '35dg-pfa2-skk5-5kq7-1dyy', 'rtmp://a.rtmp.youtube.com/live2', '', '', 1, '2025-07-07 21:48:49');

-- Copiando estrutura para tabela db_SamCast.user_settings
CREATE TABLE IF NOT EXISTS `user_settings` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `codigo_stm` int(10) NOT NULL,
  `menu_items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `sidebar_collapsed` tinyint(1) DEFAULT 0,
  `notifications_enabled` tinyint(1) DEFAULT 1,
  `auto_refresh` tinyint(1) DEFAULT 1,
  `refresh_interval` int(5) DEFAULT 30,
  `language` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'pt-BR',
  `timezone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'America/Sao_Paulo',
  `data_atualizacao` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codigo`),
  UNIQUE KEY `unique_user_settings` (`codigo_stm`),
  CONSTRAINT `user_settings_ibfk_1` FOREIGN KEY (`codigo_stm`) REFERENCES `revendas` (`codigo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela db_SamCast.user_settings: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela db_SamCast.videos
CREATE TABLE IF NOT EXISTS `videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `descricao` text DEFAULT NULL,
  `url` varchar(500) DEFAULT NULL,
  `duracao` int(11) DEFAULT NULL,
  `playlist_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  KEY `playlist_id` (`playlist_id`) USING BTREE,
  CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- Copiando dados para a tabela db_SamCast.videos: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela db_SamCast.VideosPlaylist
CREATE TABLE IF NOT EXISTS `VideosPlaylist` (
  `Id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Copiando dados para a tabela db_SamCast.VideosPlaylist: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela db_SamCast.wowza_servers
CREATE TABLE IF NOT EXISTS `wowza_servers` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `senha_root` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `porta_ssh` int(6) NOT NULL DEFAULT 22,
  `caminho_home` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '/home',
  `limite_streamings` int(10) NOT NULL DEFAULT 100,
  `grafico_trafego` tinyint(1) NOT NULL DEFAULT 1,
  `servidor_principal_id` int(10) DEFAULT NULL,
  `tipo_servidor` enum('principal','secundario','unico') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unico',
  `dominio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `streamings_ativas` int(10) NOT NULL DEFAULT 0,
  `load_cpu` int(3) NOT NULL DEFAULT 0,
  `trafego_rede_atual` decimal(10,2) NOT NULL DEFAULT 0.00,
  `trafego_mes` decimal(15,2) NOT NULL DEFAULT 0.00,
  `status` enum('ativo','inativo','manutencao') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ativo',
  `data_criacao` datetime NOT NULL DEFAULT current_timestamp(),
  `data_atualizacao` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ultima_sincronizacao` datetime DEFAULT NULL,
  PRIMARY KEY (`codigo`),
  UNIQUE KEY `unique_ip` (`ip`),
  KEY `idx_wowza_status` (`status`),
  KEY `idx_wowza_tipo` (`tipo_servidor`),
  KEY `idx_wowza_servidor_principal` (`servidor_principal_id`),
  CONSTRAINT `fk_wowza_servidor_principal` FOREIGN KEY (`servidor_principal_id`) REFERENCES `wowza_servers` (`codigo`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela db_SamCast.wowza_servers: ~1 rows (aproximadamente)
INSERT INTO `wowza_servers` (`codigo`, `nome`, `ip`, `senha_root`, `porta_ssh`, `caminho_home`, `limite_streamings`, `grafico_trafego`, `servidor_principal_id`, `tipo_servidor`, `dominio`, `streamings_ativas`, `load_cpu`, `trafego_rede_atual`, `trafego_mes`, `status`, `data_criacao`, `data_atualizacao`, `ultima_sincronizacao`) VALUES
	(1, 'Servidor Principal', '51.222.156.223', 'FK38Ca2SuE6jvJXed97VMn', 6985, '/home', 200, 1, NULL, 'unico', 'stmv1.udicast.com', 0, 0, 0.00, 0.00, 'ativo', '2025-07-21 08:18:17', '2025-07-21 08:32:39', '2025-07-21 08:32:39');

-- Copiando estrutura para tabela db_SamCast.wowza_server_migrations
CREATE TABLE IF NOT EXISTS `wowza_server_migrations` (
  `codigo` int(10) NOT NULL AUTO_INCREMENT,
  `servidor_origem_id` int(10) NOT NULL,
  `servidor_destino_id` int(10) NOT NULL,
  `streamings_migradas` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `status` enum('iniciada','em_progresso','concluida','erro','cancelada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'iniciada',
  `data_inicio` datetime NOT NULL DEFAULT current_timestamp(),
  `data_fim` datetime DEFAULT NULL,
  `detalhes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admin_responsavel` int(10) NOT NULL,
  PRIMARY KEY (`codigo`),
  KEY `idx_migration_origem` (`servidor_origem_id`),
  KEY `idx_migration_destino` (`servidor_destino_id`),
  KEY `idx_migration_admin` (`admin_responsavel`),
  KEY `idx_migration_status` (`status`),
  CONSTRAINT `fk_migration_admin` FOREIGN KEY (`admin_responsavel`) REFERENCES `administradores` (`codigo`) ON DELETE CASCADE,
  CONSTRAINT `fk_migration_servidor_destino` FOREIGN KEY (`servidor_destino_id`) REFERENCES `wowza_servers` (`codigo`) ON DELETE CASCADE,
  CONSTRAINT `fk_migration_servidor_origem` FOREIGN KEY (`servidor_origem_id`) REFERENCES `wowza_servers` (`codigo`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiando dados para a tabela db_SamCast.wowza_server_migrations: ~0 rows (aproximadamente)

-- Copiando estrutura para view db_SamCast.v_plataformas_stats
-- Criando tabela temporária para evitar erros de dependência de VIEW
CREATE TABLE `v_plataformas_stats` (
	`plataforma_nome` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`codigo_plataforma` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`usuarios_configurados` BIGINT(21) NOT NULL,
	`transmissoes_realizadas` BIGINT(21) NOT NULL,
	`transmissoes_ativas` DECIMAL(22,0) NULL
) ENGINE=MyISAM;

-- Copiando estrutura para view db_SamCast.v_transmissoes_stats
-- Criando tabela temporária para evitar erros de dependência de VIEW
CREATE TABLE `v_transmissoes_stats` (
	`codigo_stm` INT(10) NOT NULL,
	`usuario_nome` VARCHAR(1) NOT NULL COLLATE 'latin1_swedish_ci',
	`total_transmissoes` BIGINT(21) NOT NULL,
	`transmissoes_ativas` DECIMAL(22,0) NULL,
	`transmissoes_finalizadas` DECIMAL(22,0) NULL,
	`media_viewers` DECIMAL(14,4) NULL,
	`tempo_total_transmissao` DECIMAL(32,0) NULL,
	`ultima_transmissao` DATETIME NULL
) ENGINE=MyISAM;

-- Copiando estrutura para procedure db_SamCast.sp_cleanup_admin_sessions
DELIMITER //
CREATE PROCEDURE `sp_cleanup_admin_sessions`()
BEGIN
    DELETE FROM admin_sessions WHERE expires_at < NOW();
END//
DELIMITER ;

-- Copiando estrutura para procedure db_SamCast.sp_cleanup_old_data
DELIMITER //
CREATE PROCEDURE `sp_cleanup_old_data`()
BEGIN
    -- Limpar transmissões antigas (mais de 6 meses)
    DELETE FROM transmissoes 
    WHERE status = 'finalizada' 
    AND data_fim < DATE_SUB(NOW(), INTERVAL 6 MONTH);
    
    -- Limpar estatísticas antigas (mais de 1 ano)
    DELETE FROM estatisticas 
    WHERE data < DATE_SUB(NOW(), INTERVAL 1 YEAR);
    
    -- Limpar logs antigos (mais de 3 meses)
    DELETE FROM logs_streamings 
    WHERE data < DATE_SUB(NOW(), INTERVAL 3 MONTH);
    
    SELECT 'Limpeza concluída' as resultado;
END//
DELIMITER ;

-- Copiando estrutura para procedure db_SamCast.sp_dashboard_stats
DELIMITER //
CREATE PROCEDURE `sp_dashboard_stats`(IN user_id INT)
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM playlists WHERE codigo_stm = user_id) as total_playlists,
        (SELECT COUNT(*) FROM playlists_videos pv 
         JOIN playlists p ON pv.codigo_playlist = p.id 
         WHERE p.codigo_stm = user_id) as total_videos,
        (SELECT COUNT(*) FROM transmissoes WHERE codigo_stm = user_id) as total_transmissoes,
        (SELECT COUNT(*) FROM user_platforms WHERE codigo_stm = user_id AND ativo = 1) as plataformas_configuradas,
        (SELECT COUNT(*) FROM logos WHERE codigo_stm = user_id) as total_logos,
        (SELECT SUM(tamanho) FROM logos WHERE codigo_stm = user_id) as espaco_usado_logos;
END//
DELIMITER ;

-- Copiando estrutura para trigger db_SamCast.tr_playlist_videos_stats
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER IF NOT EXISTS `tr_playlist_videos_stats` 
AFTER INSERT ON `playlists_videos`
FOR EACH ROW
BEGIN
    UPDATE playlists SET 
        total_videos = (
            SELECT COUNT(*) 
            FROM playlists_videos 
            WHERE codigo_playlist = NEW.codigo_playlist
        ),
        duracao_total = (
            SELECT COALESCE(SUM(duracao_segundos), 0) 
            FROM playlists_videos 
            WHERE codigo_playlist = NEW.codigo_playlist
        )
    WHERE id = NEW.codigo_playlist;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Copiando estrutura para trigger db_SamCast.tr_playlist_videos_stats_delete
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER IF NOT EXISTS `tr_playlist_videos_stats_delete` 
AFTER DELETE ON `playlists_videos`
FOR EACH ROW
BEGIN
    UPDATE playlists SET 
        total_videos = (
            SELECT COUNT(*) 
            FROM playlists_videos 
            WHERE codigo_playlist = OLD.codigo_playlist
        ),
        duracao_total = (
            SELECT COALESCE(SUM(duracao_segundos), 0) 
            FROM playlists_videos 
            WHERE codigo_playlist = OLD.codigo_playlist
        )
    WHERE id = OLD.codigo_playlist;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Removendo tabela temporária e criando a estrutura VIEW final
DROP TABLE IF EXISTS `v_plataformas_stats`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_plataformas_stats` AS select `p`.`nome` AS `plataforma_nome`,`p`.`codigo_plataforma` AS `codigo_plataforma`,count(`up`.`codigo`) AS `usuarios_configurados`,count(`tp`.`codigo`) AS `transmissoes_realizadas`,sum(case when `tp`.`status` = 'ativa' then 1 else 0 end) AS `transmissoes_ativas` from ((`plataformas` `p` left join `user_platforms` `up` on(`p`.`codigo` = `up`.`platform_id` and `up`.`ativo` = 1)) left join `transmissoes_plataformas` `tp` on(`up`.`codigo` = `tp`.`user_platform_id`)) group by `p`.`codigo`,`p`.`nome`,`p`.`codigo_plataforma`
;

-- Removendo tabela temporária e criando a estrutura VIEW final
DROP TABLE IF EXISTS `v_transmissoes_stats`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `v_transmissoes_stats` AS select `t`.`codigo_stm` AS `codigo_stm`,`r`.`nome` AS `usuario_nome`,count(`t`.`codigo`) AS `total_transmissoes`,sum(case when `t`.`status` = 'ativa' then 1 else 0 end) AS `transmissoes_ativas`,sum(case when `t`.`status` = 'finalizada' then 1 else 0 end) AS `transmissoes_finalizadas`,avg(`t`.`viewers_pico`) AS `media_viewers`,sum(`t`.`duracao_segundos`) AS `tempo_total_transmissao`,max(`t`.`data_inicio`) AS `ultima_transmissao` from (`transmissoes` `t` join `revendas` `r` on(`t`.`codigo_stm` = `r`.`codigo`)) group by `t`.`codigo_stm`,`r`.`nome`
;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
