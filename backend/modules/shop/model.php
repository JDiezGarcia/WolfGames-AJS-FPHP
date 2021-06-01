<?php

use Utils\res;

class ShopModel extends Model {
    function details_product($product){
        $sql = "SELECT * FROM games WHERE gameCod='$product'";
        $sqlUpdate = "UPDATE games
                        SET views = views + 1
                        WHERE gameCod='$product'";		
        
        $this->db->query($sqlUpdate);

        $res = $this->db->query($sql)->query->fetch_all(MYSQLI_ASSOC)[0];
        return $res;
    }

    function select_products( $genres, $platformCod, $search, $offset) {			
        
        //-------------[STARTING QUERIES]--------------\\
        $sqlGames = "SELECT DISTINCT g.*
                        FROM games g
                        INNER JOIN  games_gameGenre gg ON gg.gameCod = g.gameCod";
        
        $sqlTotalG = "SELECT DISTINCT g.gameCod total
                        FROM games g
                        INNER JOIN  games_gameGenre gg ON gg.gameCod = g.gameCod";

        $sqlGenres = "SELECT g.genreName, COUNT(g.genreName) total
                        FROM games_gameGenre g";

        $sqlPlatforms = "SELECT g.platformCod, COUNT(g.platformCod) total
                        FROM games_platforms g";

        $sqlAllG = "SELECT * FROM gameGenre";
        $sqlAllP = "SELECT * FROM platforms";
        $sqlAdd = "";

        //-------------[ADDING TO QUERIES GENRES]--------------\\
        if (count($genres) > 0) {
            foreach ($genres as $i => $genre) {
                if ($i != 0) {
                    $sqlAdd .= " AND ";
                } else {
                    $sqlAdd .= " WHERE ";
                }

                $sqlAdd .= "EXISTS (
                                SELECT *
                                FROM games_gameGenre gg2
                                WHERE gg2.gameCod = g.gameCod
                                AND gg2.genreName = '$genre'
                                )";
            }
        }

        //-------------[ADDING PLATFORM TO QUERIES]--------------\\
        if ($platformCod) {
            foreach ($platformCod as $i => $platform) {
                if ($i != 0 || count($genres) > 0) {
                    $sqlAdd .= " AND ";
                } else {
                    $sqlAdd .= " WHERE ";
                }
                $sqlAdd .= " EXISTS(
                                SELECT *
                                FROM games_platforms gp
                                WHERE g.gameCod = gp.gameCod
                                AND gp.platformCod='$platform' 
                                )";
            }
        }

        //-------------[ADDING SUBQUERYS TO QUERIES]--------------\\
        if ($sqlAdd){
            $sqlGames .= $sqlAdd;
            $sqlGenres .= $sqlAdd;
            $sqlTotalG .= $sqlAdd;
            $sqlPlatforms .= $sqlAdd;
        }

        //-------------[ADDING SEARCH TO QUERIES]--------------\\
        if ($search) {
            if (count($genres) > 0 || count($platformCod) > 0) {
                $sqlGames .= " AND";
                $sqlGenres .= " AND";
                $sqlTotalG .= " AND";
                $sqlPlatforms .= " AND";
            } else {
                $sqlGames .= " WHERE";
                $sqlGenres .= " WHERE";
                $sqlTotalG .= " WHERE";
                $sqlPlatforms .= " WHERE";
            }
            $sqlGames .= " g.gameName LIKE '%$search%'";
            $sqlTotalG .= " g.gameName LIKE '%$search%'";;
            $sqlGenres .= " EXISTS(
                                SELECT *
                                FROM games g1
                                WHERE g1.gameCod = g.gameCod
                                AND g1.gameName LIKE '%$search%' 
                                )";
            $sqlPlatforms .= " EXISTS(
                                SELECT *
                                FROM games g1
                                WHERE g1.gameCod = g.gameCod
                                AND g1.gameName LIKE '%$search%' 
                                )";
        }

        //-------------[ADDING OFFSET TO QUERIES]--------------\\
        $sqlGames .= " LIMIT 8 OFFSET $offset";
        
        //-------------[ADDING GROUP BY TO QUERIES]--------------\\
        $sqlGenres .= " GROUP BY g.genreName";
        $sqlPlatforms .= " GROUP BY g.platformCod";

        
        //-------------[STARTING CONEXION TO DO QUERIES]--------------\\
        $resT = $this->db->query($sqlTotalG)->query->fetch_all(MYSQLI_ASSOC);
        $resG = $this->db->query($sqlGames)->query->fetch_all(MYSQLI_ASSOC);
        $resGC = $this->db->query($sqlGenres)->query->fetch_all(MYSQLI_ASSOC);
        $resPC = $this->db->query($sqlPlatforms)->query->fetch_all(MYSQLI_ASSOC);
        $resAP = $this->db->query($sqlAllP)->query->fetch_all(MYSQLI_ASSOC);
        $resAG = $this->db->query($sqlAllG)->query->fetch_all(MYSQLI_ASSOC);
        $returnRes = array();

        $returnRes['total']= count($resT);

        foreach($resG as $game) {
            $returnRes['games'][] = $game;
        }

        foreach($resGC as $genre) {
            $returnRes['genres'][] = $genre;
        }

        foreach($resPC as $platform) {
            $returnRes['platforms'][] = $platform;
        }
        
        foreach($resAG as $allGenre) {
            $returnRes['allGenres'][] = $allGenre;
        }

        foreach($resAP as $allPlatform) {
            $returnRes['allPlatforms'][] = $allPlatform;
        }

        return $returnRes;

        
    }
}
?>
