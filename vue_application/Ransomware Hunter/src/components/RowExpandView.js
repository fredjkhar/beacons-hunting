export function checkRow(row){
    if(row != null){
        for(let i = 0; i < 10; i++){
            if(row[i] == null){
                return false;
            } 
        }
        return true;
    }
    else {
        return false;
    }
}