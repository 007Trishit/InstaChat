const CLOUDINARY_UPLOAD_PRESET='kdanm5hs';
const CLOUDINARY_URL='https://api.cloudinary.com/v1_1/dsacngys7/upload'

class Chat{
    constructor(boxId,userMail,other){
        this.userMail=userMail;
        this.box=$(`#${boxId}`);
        this.otherUser = other;
        this.socket=io();
        if(userMail)
            this.connectionHandler();
    }
    connectionHandler(){
        const self = this;
        this.socket.on('connect',function(){
            console.log("Connected to chat server!");
        });
        this.socket.emit('join_room',{me:this.userMail,other:this.otherUser});
        this.socket.on('new_person',function(data){
            alert(data.message);
        });
        this.socket.on('get_mssg',function(data){
            let item;
            let val = data.val;
            if(data.mode=='global')return alert(val);
            setTimeout(function(){
                if(val.startsWith("https"))
                    val=`<img src="${val}" class="img">`;
                let name = $('#chat-name').text();
                item = $(`<p><small>${name}</small>${val}</p>`);
                item.addClass('other-mssg');
            
                $('#body-chat').append(item);
            },1000);
            
        });
        var participants = {from:this.userMail,to:this.otherUser};
        $('#mssg-send').on('click',function(){
            let val = $('#mssg-form').val();
            let type=0;
            $('#mssg-form').val("");
            if(val===""){
                type=1;
                let formData = new FormData();
                formData.append('file',document.getElementById('mssg-img').files[0]);
                formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
                axios({
                    url:CLOUDINARY_URL,
                    method: 'POST',
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}, 
                    data: formData
                })
                .then(res =>{
                    val=res.data.secure_url;
                    $.ajax({
                        type: "POST",
                        url: "/message/save",
                        data:{val:val,par:participants,type},
                        success: function (response) {
                            console.log(response.message);
                            val=`<img src="${val}" class="img">`;
                            let item = $(`<p>${val}</p>`);
                            item.addClass('self-mssg');
                            $('#body-chat').append(item);
                            self.socket.emit('new_mssg',{val:val,email:self.userMail});
                        }
                    });
                })
            }else{

                self.socket.emit('new_mssg',{val:val,email:self.userMail});
                if(val.startsWith('*')&&val.endsWith('*'))
                    return alert(val);
                let item = $(`<p>${val}</p>`);
                item.addClass('self-mssg');
                $('#body-chat').append(item);
            }
            $.ajax({
                type: "POST",
                url: "/message/save",
                data:{val:val,par:participants,type},
                success: function (response) {
                    console.log(response.message);
                }
            });
        });
    }
}