-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 08-06-2021 a las 21:34:24
-- Versión del servidor: 10.3.27-MariaDB-0+deb10u1
-- Versión de PHP: 7.3.27-1~deb10u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `wolf_games`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`javier`@`%` PROCEDURE `checkOut` (IN `user` VARCHAR(100))  BEGIN			
    DECLARE orderCod INT DEFAULT 0;
    DECLARE totalPrice float;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;     
        SELECT oh.idOrder INTO orderCod FROM order_header oh WHERE oh.userCod = user AND oh.status = 'P';
        UPDATE order_lines ol INNER JOIN games g ON g.gameCod = ol.gameCod SET ol.price = g.price WHERE ol.idOrder = orderCod;
        SELECT SUM(ol.price*ol.quantity) INTO totalPrice FROM order_lines ol WHERE ol.idOrder = orderCod;
        UPDATE order_header SET total = totalPrice, orderDate = CURRENT_TIMESTAMP(), `status` = 'F' WHERE idOrder = orderCod;
    COMMIT;

    SELECT * FROM order_header WHERE userCod = user AND idOrder = orderCod ;
END$$

CREATE DEFINER=`javier`@`%` PROCEDURE `retrieveOrder` (IN `orderCod` INT)  BEGIN			    
    SELECT ol.gameCod, g.price, ol.quantity, g.gameName, g.gameImg FROM order_lines ol INNER JOIN games g ON g.gameCod = ol.gameCod WHERE idOrder = orderCod;
END$$

CREATE DEFINER=`javier`@`%` PROCEDURE `selectHeader` (IN `user` VARCHAR(100))  BEGIN			
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
       ROLLBACK;
       RESIGNAL;
    END;
    START TRANSACTION;     
        IF NOT EXISTS(SELECT * FROM order_header oh WHERE oh.userCod = user AND oh.status = 'P')THEN
            INSERT INTO order_header (userCod) VALUES (user);
        END IF;
    COMMIT;

    SELECT idOrder FROM order_header WHERE userCod = user AND `status` = 'P';
END$$

--
-- Funciones
--
CREATE DEFINER=`javier`@`%` FUNCTION `favsActions` (`user` VARCHAR(100), `game` VARCHAR(50)) RETURNS TINYINT(1) BEGIN
   	IF NOT EXISTS( SELECT * FROM games_favs AS gf WHERE gf.userCod = user AND gf.gameCod = game ) THEN
        INSERT INTO `games_favs` (`userCod`, `gameCod`) VALUES (user, game);
        RETURN 0;
    ELSE
        DELETE FROM games_favs WHERE gameCod = game AND userCod = user;
        RETURN 1;
    END IF;
END$$

CREATE DEFINER=`javier`@`%` FUNCTION `insertUser` (`user` VARCHAR(50), `email` VARCHAR(100), `pass` VARCHAR(100), `name` VARCHAR(50), `lastname` VARCHAR(50), `dir` VARCHAR(100), `postcode` VARCHAR(50), `city` VARCHAR(50), `country` VARCHAR(100), `sex` VARCHAR(20), `birthdate` VARCHAR(10), `img` VARCHAR(255)) RETURNS INT(11) BEGIN
	DECLARE userCod VARCHAR(100);
	IF NOT EXISTS(SELECT * FROM users AS u WHERE u.email = email OR u.user = user ) THEN
    	SET userCod = CONCAT('LOCAL-',user);
        INSERT INTO `users` (`userCod`,`user`, `email`, `pass`, `name`, `lastname`, `dir`, `postcode`, `city`, `country`, `sex`, `birthdate`, `img`) 
        VALUES (userCod,user, email, pass, name, lastname, dir, postcode, city, country, sex, birthdate, img);
        RETURN 0;
    ELSE
    	RETURN 1;
	END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gameGenre`
--

CREATE TABLE `gameGenre` (
  `genreID` int(11) NOT NULL,
  `genreName` varchar(50) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `gameGenre`
--

INSERT INTO `gameGenre` (`genreID`, `genreName`) VALUES
(1, 'action'),
(2, 'fantasy'),
(10, 'fighting'),
(12, 'FPS'),
(8, 'horror'),
(5, 'MMO'),
(6, 'platformers'),
(13, 'Roguelike'),
(4, 'RPG'),
(7, 'sandbox'),
(9, 'simulation'),
(11, 'survival');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `games`
--

CREATE TABLE `games` (
  `gameCod` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `gameName` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `relDate` varchar(10) COLLATE utf8_spanish_ci NOT NULL,
  `price` float(10,2) NOT NULL,
  `type` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `pgi` int(2) NOT NULL,
  `description` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `gameImg` varchar(50) COLLATE utf8_spanish_ci DEFAULT NULL,
  `views` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `games`
--

INSERT INTO `games` (`gameCod`, `gameName`, `relDate`, `price`, `type`, `pgi`, `description`, `gameImg`, `views`) VALUES
('CRA-004', 'Crash Bandicoot 4: Its About Time', '18/04/2021', 69.99, 'Game', 13, 'crashbandicoot4-desc', 'crashbandicoot4-cover.jpg', 350),
('DEC-001', 'Dead Cells', '12/12/2018', 44.99, 'Game', 16, 'deadcells-des', 'deadcells-cover.jpg', 136),
('GOT-001', 'Gothic', '10/10/1999', 44.99, 'Game', 16, 'gothic-des', 'gothic-cover.jpg', 91),
('GOT-002', 'Gothic 2', '09/04/2004', 49.99, 'Game', 16, 'gothic2-des', 'gothic2-cover.jpg', 27),
('GOT-003', 'Gothic 3', '10/10/1999', 44.99, 'Game', 16, 'gothic3-des', 'gothic3-cover.jpg', 25),
('HAL-005', 'HALO 5: Guardians', '03/09/2017', 69.99, 'Game', 16, 'halo5-des', 'halo5guardians-cover.jpg', 54),
('HOK-001', 'Hollow Knight', '09/04/2014', 49.99, 'Game', 16, 'hollowknight-des', 'hollowknight-cover.jpg', 15),
('THW-001', 'The Witcher', '05/03/2001', 59.99, 'Game', 16, 'thewitcher-des', 'thewitcher-cover.jpg', 5),
('THW-002', 'The Witcher 2: Assassins of Kings', '05/03/2006', 59.99, 'Game', 18, 'thewitcher2-des', 'thewitcher2-cover.jpg', 6),
('THW-003', 'The Witcher 3: Wild Hunt', '12/06/2014', 59.99, 'Game', 18, 'thewitcher3-des', 'thewitcher3-cover.jpg', 10),
('TLU-001', 'The Last of Us', '12/06/2010', 59.99, 'Game', 18, 'thelastofus-des', 'thelastofus-cover.jpg', 25),
('TLU-002', 'The Last of Us 2', '12/06/2010', 69.99, 'Game', 18, 'thelastofus2-des', 'thelastofus2-cover.jpg', 14),
('ZEB-001', 'Zelda: Breath of the Wild', '12/01/2018', 44.99, 'Game', 16, 'zeldabreathofthewild-des', 'zeldabreathofthewild-cover.jpg', 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `games_favs`
--

CREATE TABLE `games_favs` (
  `ID` int(11) NOT NULL,
  `userCod` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `gameCod` varchar(50) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `games_favs`
--

INSERT INTO `games_favs` (`ID`, `userCod`, `gameCod`) VALUES
(204, 'LOCAL-xavier', 'CRA-004'),
(80, 'LOCAL-xavier', 'THW-001'),
(205, 'LOCAL-xavier', 'THW-003'),
(104, 'LOCAL-xavier', 'TLU-001'),
(105, 'LOCAL-xavier', 'TLU-002');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `games_gameGenre`
--

CREATE TABLE `games_gameGenre` (
  `ID` int(11) NOT NULL,
  `genreName` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `gameCod` varchar(50) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `games_gameGenre`
--

INSERT INTO `games_gameGenre` (`ID`, `genreName`, `gameCod`) VALUES
(4, 'action', 'CRA-004'),
(47, 'action', 'DEC-001'),
(46, 'action', 'HAL-005'),
(38, 'action', 'HOK-001'),
(35, 'action', 'THW-001'),
(36, 'action', 'THW-002'),
(1, 'action', 'THW-003'),
(2, 'action', 'TLU-001'),
(6, 'action', 'TLU-002'),
(44, 'action', 'ZEB-001'),
(10, 'fantasy', 'GOT-001'),
(11, 'fantasy', 'GOT-002'),
(12, 'fantasy', 'GOT-003'),
(43, 'fantasy', 'ZEB-001'),
(45, 'FPS', 'HAL-005'),
(15, 'horror', 'TLU-001'),
(16, 'horror', 'TLU-002'),
(3, 'platformers', 'CRA-004'),
(51, 'platformers', 'DEC-001'),
(39, 'platformers', 'HOK-001'),
(49, 'Roguelike', 'DEC-001'),
(48, 'RPG', 'DEC-001'),
(24, 'RPG', 'GOT-001'),
(25, 'RPG', 'GOT-002'),
(26, 'RPG', 'GOT-003'),
(40, 'RPG', 'HOK-001'),
(34, 'RPG', 'THW-001'),
(23, 'RPG', 'THW-002'),
(22, 'RPG', 'THW-003'),
(42, 'RPG', 'ZEB-001'),
(27, 'sandbox', 'GOT-001'),
(28, 'sandbox', 'GOT-002'),
(29, 'sandbox', 'GOT-003'),
(7, 'sandbox', 'THW-001'),
(8, 'sandbox', 'THW-002'),
(33, 'sandbox', 'THW-003'),
(5, 'sandbox', 'TLU-002'),
(41, 'sandbox', 'ZEB-001'),
(50, 'survival', 'DEC-001'),
(13, 'survival', 'TLU-001'),
(14, 'survival', 'TLU-002');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `games_platforms`
--

CREATE TABLE `games_platforms` (
  `ID` int(11) NOT NULL,
  `platformCod` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `gameCod` varchar(50) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `games_platforms`
--

INSERT INTO `games_platforms` (`ID`, `platformCod`, `gameCod`) VALUES
(1, 'COMP001', 'CRA-004'),
(26, 'COMP001', 'DEC-001'),
(2, 'COMP001', 'GOT-001'),
(6, 'COMP001', 'GOT-002'),
(7, 'COMP001', 'GOT-003'),
(28, 'COMP001', 'HAL-005'),
(31, 'COMP001', 'HOK-001'),
(8, 'COMP001', 'THW-001'),
(9, 'COMP001', 'THW-002'),
(11, 'COMP001', 'THW-003'),
(3, 'PLAY001', 'CRA-004'),
(33, 'PLAY001', 'HOK-001'),
(12, 'PLAY001', 'THW-003'),
(15, 'PLAY001', 'TLU-001'),
(16, 'PLAY001', 'TLU-002'),
(4, 'SWIT001', 'CRA-004'),
(27, 'SWIT001', 'DEC-001'),
(30, 'SWIT001', 'HOK-001'),
(13, 'SWIT001', 'THW-003'),
(32, 'SWIT001', 'ZEB-001'),
(5, 'XBOX001', 'CRA-004'),
(29, 'XBOX001', 'HAL-005'),
(34, 'XBOX001', 'HOK-001'),
(10, 'XBOX001', 'THW-002'),
(14, 'XBOX001', 'THW-003');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `order_header`
--

CREATE TABLE `order_header` (
  `idOrder` int(11) NOT NULL,
  `userCod` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `status` varchar(50) COLLATE utf8_spanish_ci NOT NULL DEFAULT 'P',
  `orderDate` timestamp NULL DEFAULT NULL,
  `total` float NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `order_header`
--

INSERT INTO `order_header` (`idOrder`, `userCod`, `status`, `orderDate`, `total`) VALUES
(1, 'LOCAL-xavier', 'F', '2021-06-08 19:32:23', 344.94);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `order_lines`
--

CREATE TABLE `order_lines` (
  `idLine` int(11) NOT NULL,
  `idOrder` int(11) NOT NULL,
  `gameCod` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `price` float NOT NULL DEFAULT 0,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `order_lines`
--

INSERT INTO `order_lines` (`idLine`, `idOrder`, `gameCod`, `price`, `quantity`) VALUES
(7, 1, 'CRA-004', 69.99, 3),
(8, 1, 'GOT-001', 44.99, 2),
(9, 1, 'GOT-003', 44.99, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `platforms`
--

CREATE TABLE `platforms` (
  `platformCod` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `platformName` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `platformImg` varchar(50) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `platforms`
--

INSERT INTO `platforms` (`platformCod`, `platformName`, `platformImg`) VALUES
('COMP001', 'PC', 'comp001.jpg'),
('PLAY001', 'PlayStation 5', 'play001.jpg'),
('SWIT001', 'Switch', 'swit001.jpg'),
('XBOX001', 'XBOX Series X', 'xbox001.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `shops`
--

CREATE TABLE `shops` (
  `shopCod` int(11) NOT NULL,
  `shopName` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `shopDesc` varchar(500) COLLATE utf8_spanish_ci NOT NULL,
  `shopLat` decimal(8,6) NOT NULL,
  `shopLon` decimal(9,6) NOT NULL,
  `shopImg` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `shopAddress` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `shopPost` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `shopCity` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `shopState` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `shopCountry` varchar(50) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `shops`
--

INSERT INTO `shops` (`shopCod`, `shopName`, `shopDesc`, `shopLat`, `shopLon`, `shopImg`, `shopAddress`, `shopPost`, `shopCity`, `shopState`, `shopCountry`) VALUES
(1, 'Ontinyent WolfGames', 'ONT-001', '38.824108', '-0.605237', 'ONT-001.jpg', 'Carrer del Pintor Josep Segrelles, 1', '46870', 'Ontinyent', 'Valencia', 'España'),
(2, 'Speed WolfGames', 'MAD-001-ES', '40.426247', '-3.716018', 'default.jpg', 'Calle de Preciados, 34', '28013', 'Madrid', 'Madrid', 'España'),
(3, 'Ferrel WolfGames', 'MAD-001-PT', '39.796225', '-7.559916', 'default.jpg', 'Antonio Pedro Antunes Catarino, Av. do Mar 97', '2520-061', 'Ferrel', 'Ferrel', 'Portugal'),
(4, 'SpiderMan WolfGames', 'NYK-001-USA', '40.782088', '-73.971361', 'default.jpg', '165 E 116th St', '10029', 'NY', 'New York', 'Estados Unidos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `userCod` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `user` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `pass` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `verify` bit(1) NOT NULL DEFAULT b'0',
  `name` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `lastname` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `dir` varchar(100) COLLATE utf8_spanish_ci DEFAULT NULL,
  `postcode` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `city` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `country` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `sex` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `birthdate` varchar(10) COLLATE utf8_spanish_ci NOT NULL,
  `img` varchar(255) COLLATE utf8_spanish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`userCod`, `user`, `email`, `pass`, `verify`, `name`, `lastname`, `dir`, `postcode`, `city`, `country`, `sex`, `birthdate`, `img`) VALUES
('LOCAL-anca', 'anca', 'a@b.com', 'cc6ef3b68906e0b55d60736579e2a51f', b'0', 'ang', 'aa', 'C/San Pedro 12, Puerta 3', '46000', 'Agullen', 'España', 'Hombre', '19/07/1993', 'user-1.jpg'),
('LOCAL-anco', 'anco', 'b@a.com', 'cc6ef3b68906e0b55d60736579e2a51f', b'0', 'ang', 'a', 'C/San Pedro 12, Puerta 3', '46000', 'Agullen', 'España', 'Hombre', '19/07/1993', 'user-2.jpg'),
('LOCAL-ancoca', 'ancoca', 'a@b.con', 'cc6ef3b68906e0b55d60736579e2a51f', b'0', 'angel', 'aa', 'C/San Pedro 12, Puerta 3', '46000', 'Agullent', 'España', 'Hombre', '19/07/1993', 'user-12.jpg'),
('LOCAL-ancoca33', 'ancoca33', 'a@b.cox', 'cc6ef3b68906e0b55d60736579e2a51f', b'0', 'angel', 'a', 'C/San Pedro 12, Puerta 3', '46000', 'Agullent', 'España', 'Hombre', '19/07/1993', 'user-11.jpg'),
('LOCAL-Antonio', 'Antonio', 'a@b.coa', 'cc6ef3b68906e0b55d60736579e2a51f', b'0', 'usuario', 'a', 'C/San Pedro 12, Puerta 3', '46000', 'Agullent', 'España', 'Hombre', '16/05/1980', 'user-13.jpg'),
('LOCAL-Antoniooo', 'antonioooo', 'a@b.co2', 'cc6ef3b68906e0b55d60736579e2a51f', b'0', 'usuario', 'a', 'C/San Pedro 12, Puerta 3', '46000', 'Agullent', 'España', 'Hombre', '16/05/1980', 'user-20.jpg'),
('LOCAL-asss', 'asss', 'wolfsr@mail.co', '403a9e9a804196b3aaf53b6320a4e37b', b'0', 'JNuñer', 'Garcià', 'C/San Ramón 14, piso 3, puerta 6', '46890', 'Agullent', 'España', 'Male', '1993/12/12', 'user-2.jpg'),
('LOCAL-daurgil', 'daurgil', 'a@b.co3', '280430f61f6bc9c83b62138cdb0cbe1d', b'0', 'david', 'a', 'C/San Pedro 12, Puerta 3', '46000', 'Agullent', 'Francia', 'Mujer', '06/06/1990', 'user-23.jpg'),
('LOCAL-herc', 'herc', 'e@f.com', 'cc6ef3b68906e0b55d60736579e2a51f', b'0', 'ang', 'a', 'C/San Pedro 12, Puerta 3', '46000', 'Agullen', 'España', 'Hombre', '19/07/1993', 'user-2.jpg'),
('LOCAL-jesus', 'jesus', 'a@b.co1', 'cc6ef3b68906e0b55d60736579e2a51f', b'0', 'david', 'a', 'C/San Pedro 12, Puerta 3', '46000', 'Agullent', 'España', 'Hombre', '06/06/1990', 'user-21.jpg'),
('LOCAL-jesusm', 'jesusm', 'a@ss.com', '280430f61f6bc9c83b62138cdb0cbe1d', b'0', 'hola', 'a', 'gominola 12', '2222s', 'Agullent', 'España', 'Hombre', '12/12/1994', 'user-2.jpg'),
('LOCAL-jose', 'jose', 'a@b.cos', 'cc6ef3b68906e0b55d60736579e2a51f', b'0', 'usuario', 'a', 'C/San Pedro 12, Puerta 3', '46000', 'Agullent', 'España', 'Hombre', '16/05/1980', 'user-24.jpg'),
('LOCAL-joselu', 'joselu', 'a@b.coq', 'cc6ef3b68906e0b55d60736579e2a51f', b'0', 'usuario', 'a', 'C/San Pedro 12, Puerta 3', '46000', 'Agullent', 'España', 'Hombre', '16/05/1980', 'user-7.jpg'),
('LOCAL-kevin', 'kevin', 'kevin@v.com', '403a9e9a804196b3aaf53b6320a4e37b', b'0', 'Kevin', 'Kamos', 'C/ Alberto', '465465', 'Onteniente', 'Spain', 'Other', '1994/06/03', 'user-24.jpg'),
('LOCAL-luis', 'luis', 'a@b.co0', 'cc6ef3b68906e0b55d60736579e2a51f', b'0', 'usuario', 'a', 'C/San Pedro 12, Puerta 3', '46000', 'Agullent', 'España', 'Hombre', '16/05/1980', 'user-5.jpg'),
('LOCAL-Manuel', 'Manuel', 'a@b.col', 'cc6ef3b68906e0b55d60736579e2a51f', b'0', 'usuario', 'a', 'C/San Pedro 12, Puerta 3', '46000', 'Agullent', 'España', 'Hombre', '16/05/1980', 'user-1.jpg'),
('LOCAL-pedroo', 'pedroo', 'wolfsater@gmail.co', 'aa68f70d4a3cb632d2576e30956acba4', b'0', 'Javier', 'Garcia', 'C/San Ramón 14, piso 3, puerta 6', '46890', 'Agullent', 'España', 'Male', '1993/12/12', 'user-13.jpg'),
('LOCAL-wolf', 'wolf', 'a@b.cob', 'cc6ef3b68906e0b55d60736579e2a51f', b'0', 'usuario', 'a', 'C/San Pedro 12, Puerta 3', '46000', 'Agullent', 'Francia', 'Mujer', '16/05/1980', 'user-9.jpg'),
('LOCAL-wolsarr', 'wolfsarr', 'wolfsartr@gmail.com', '214fb33f3f0df573a19ad3a734c4076a', b'0', 'Javier', 'Garcia', 'C/San Ramón 14, piso 3, puerta 6', '46890', 'Agullent', 'España', 'Male', '1994/12/12', 'user-9.jpg'),
('LOCAL-xavier', 'xavier', 'wolfsarter@gmail.com', '403a9e9a804196b3aaf53b6320a4e37b', b'0', 'Javier', 'Garcia', 'C/San Ramón 14, piso 3, puerta 6', '46890', 'Agullent', 'España', 'Male', '1994/12/12', 'user-11.jpg'),
('LOCAL-xavo', 'xavo', 'kevin@vll.com', '403a9e9a804196b3aaf53b6320a4e37b', b'0', 'Kevin', 'Kamos', 'C/ Alberto KA', '465465', 'Onteniente', 'Spain', 'Male', '1994/12/11', 'user-2.jpg');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `gameGenre`
--
ALTER TABLE `gameGenre`
  ADD PRIMARY KEY (`genreID`),
  ADD UNIQUE KEY `genreName` (`genreName`);

--
-- Indices de la tabla `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`gameCod`),
  ADD UNIQUE KEY `gameName` (`gameName`);

--
-- Indices de la tabla `games_favs`
--
ALTER TABLE `games_favs`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `NONCLUSTERED` (`userCod`,`gameCod`),
  ADD KEY `gameCod` (`gameCod`);

--
-- Indices de la tabla `games_gameGenre`
--
ALTER TABLE `games_gameGenre`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `NONCLUSTERED` (`genreName`,`gameCod`),
  ADD KEY `gameCod` (`gameCod`);

--
-- Indices de la tabla `games_platforms`
--
ALTER TABLE `games_platforms`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `NONCLUSTERED` (`platformCod`,`gameCod`),
  ADD KEY `gameCod` (`gameCod`);

--
-- Indices de la tabla `order_header`
--
ALTER TABLE `order_header`
  ADD PRIMARY KEY (`idOrder`),
  ADD UNIQUE KEY `NONCLUSTERED` (`userCod`,`idOrder`);

--
-- Indices de la tabla `order_lines`
--
ALTER TABLE `order_lines`
  ADD PRIMARY KEY (`idLine`),
  ADD UNIQUE KEY `NONCLUSTERED` (`gameCod`,`idOrder`),
  ADD KEY `idOrder` (`idOrder`);

--
-- Indices de la tabla `platforms`
--
ALTER TABLE `platforms`
  ADD PRIMARY KEY (`platformCod`);

--
-- Indices de la tabla `shops`
--
ALTER TABLE `shops`
  ADD PRIMARY KEY (`shopCod`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userCod`,`user`) USING BTREE,
  ADD UNIQUE KEY `user` (`user`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `userCod` (`userCod`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `gameGenre`
--
ALTER TABLE `gameGenre`
  MODIFY `genreID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `games_favs`
--
ALTER TABLE `games_favs`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=207;

--
-- AUTO_INCREMENT de la tabla `games_gameGenre`
--
ALTER TABLE `games_gameGenre`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT de la tabla `games_platforms`
--
ALTER TABLE `games_platforms`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `order_header`
--
ALTER TABLE `order_header`
  MODIFY `idOrder` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `order_lines`
--
ALTER TABLE `order_lines`
  MODIFY `idLine` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `shops`
--
ALTER TABLE `shops`
  MODIFY `shopCod` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `games_favs`
--
ALTER TABLE `games_favs`
  ADD CONSTRAINT `games_favs_ibfk_1` FOREIGN KEY (`userCod`) REFERENCES `users` (`userCod`),
  ADD CONSTRAINT `games_favs_ibfk_2` FOREIGN KEY (`gameCod`) REFERENCES `games` (`gameCod`);

--
-- Filtros para la tabla `games_gameGenre`
--
ALTER TABLE `games_gameGenre`
  ADD CONSTRAINT `games_gameGenre_ibfk_1` FOREIGN KEY (`genreName`) REFERENCES `gameGenre` (`genreName`),
  ADD CONSTRAINT `games_gameGenre_ibfk_2` FOREIGN KEY (`gameCod`) REFERENCES `games` (`gameCod`);

--
-- Filtros para la tabla `games_platforms`
--
ALTER TABLE `games_platforms`
  ADD CONSTRAINT `games_platforms_ibfk_1` FOREIGN KEY (`platformCod`) REFERENCES `platforms` (`platformCod`),
  ADD CONSTRAINT `games_platforms_ibfk_2` FOREIGN KEY (`gameCod`) REFERENCES `games` (`gameCod`);

--
-- Filtros para la tabla `order_header`
--
ALTER TABLE `order_header`
  ADD CONSTRAINT `order_header_ibfk_1` FOREIGN KEY (`userCod`) REFERENCES `users` (`userCod`);

--
-- Filtros para la tabla `order_lines`
--
ALTER TABLE `order_lines`
  ADD CONSTRAINT `order_lines_ibfk_1` FOREIGN KEY (`gameCod`) REFERENCES `games` (`gameCod`),
  ADD CONSTRAINT `order_lines_ibfk_2` FOREIGN KEY (`idOrder`) REFERENCES `order_header` (`idOrder`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
