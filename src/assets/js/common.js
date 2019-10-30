

export const successTip = function(text){
    this.$message({

        message: text,
        type: 'success',

    });
}

export const errorTip = function(text){
    this.$message({
        message: text,
        type: 'error',
    });
}