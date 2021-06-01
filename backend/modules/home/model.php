<?php

class HomeModel extends Model {

    function carousel($offset){
        $sqlGames = "SELECT * FROM games ORDER BY views DESC LIMIT 12 OFFSET $offset";
        $sqlTotal = "SELECT COUNT(g.gameCod) total FROM games g";
        
        $resG = $this->db->query($sqlGames)->query->fetch_all(MYSQLI_ASSOC);
        $resT = $this->db->query($sqlTotal)->query->fetch_all(MYSQLI_ASSOC)[0]['total'];
        $returnRes = array();
        
        foreach($resG as $game) {
            $returnRes['games'][] = $game;
        }

        $returnRes['total'] = $resT;

        return $returnRes;
    }
    
    function platforms_img(){
        
        $sql = "SELECT * FROM platforms";
        $res = $this->db->query($sql)->query->fetch_all(MYSQLI_ASSOC);
        return $res;
    }
}
?>
