<?php

class SearchModel extends Model {

    function search_bar($query) {

        $sql = "SELECT * FROM games WHERE gameName LIKE '%$query%'";
        $res = $this->db->query($sql)->query->fetch_all(MYSQLI_ASSOC);
        return $res;
    }

}
