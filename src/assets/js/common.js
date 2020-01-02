

export const successTip = function (text) {
    this.$message.closeAll()
    this.$message({

        message: text,
        type: 'success',

    });
}

export const errorTip = function (text) {
    this.$message.closeAll()
    this.$message({
        message: text,
        type: 'error',
    });
}
const func = {
    openLinkTo(url, token = 0) {


        var tempwindow = window.open();
        if (token) {
            url += sessionStorage.getItem('x-access-token')
        }
        tempwindow.location = url;
        console.log(tempwindow.location);
    },
}

export default func