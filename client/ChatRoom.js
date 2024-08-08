import React, { useEffect, useState } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient =null;
const ChatRoom = () => {
	//değiştiginde render edilen değişkenler useState bildigin deger tutmak için 
    const [privateChats, setPrivateChats] = useState(new Map());      //map key-value yapısı	
    const [publicChats, setPublicChats] = useState([]); //array
    const [tab,setTab] =useState("CHATROOM"); //hangi sekmede oldugunu 
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
      });
	  /*
	  Bu state'ler, bir bileşenin içindeki değişken değerlerini tutar ve bu değerlerin güncellenmesi durumunda bileşenin yeniden render edilmesini sağlar. 
	  */
	  
	  
	  
	  
    useEffect(() => {
      console.log(userData);
    }, [userData]); //userdata değiştikçe bu arrayin içinde oldugu için ona bakıyoruz usereffect çalışır

    const connect =()=>{ //
        let Sock = new SockJS('http://localhost:8080/ws'); //websocket baglantısı kurulur
        stompClient = over(Sock); // sockjs üzerinden stomp client oluşturulur
        stompClient.connect({},onConnected, onError); // baglantı aranır çalışırsa onconnceted çalışmassa onerror çalıştırlır
    }

    const onConnected = () => {
        setUserData({...userData,"connected": true}); // kullanıcı durumunu günceller ve connceted true olarak değiştirir
        stompClient.subscribe('/chatroom/public', onMessageReceived); // chatroom/public kanalına abone ol gelen mesajları onmessage recevied ile işle
        stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage); // kendine gelen mesajları onprivatemessage ile işle 
        userJoin(); //kullanıcı sohbete katıldı bilgisini sunucuya ilet
    }

    const userJoin=()=>{
          var chatMessage = {
            senderName: userData.username,
            status:"JOIN"
          };
          stompClient.send("/app/message", {}, JSON.stringify(chatMessage)); //{} boş başlık ile app message kanalına json formatına çevrilmiş sender name ve status bilgisi paylaşılır
    }

    const onMessageReceived = (payload)=>{
        var payloadData = JSON.parse(payload.body); //json dosyası çözümlenir
        switch(payloadData.status){ //gelene mesajın durumuna göre join mi yoksa messagemı durumuna göre incelenir
            case "JOIN": 
                if(!privateChats.get(payloadData.senderName)){ 
                    privateChats.set(payloadData.senderName,[]); //Kullanıcının adını özel sohbet listesine ekler ve bu kullanıcıya ait özel sohbet listesini boş bir diziyle başlatır.
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData); // genel sohbette pushlanıyor
                setPublicChats([...publicChats]); //spred operetörü başka bir diziye kopyalarken daha güvenli yapıyor
                break;
        }
    }
    
    const onPrivateMessage = (payload)=>{
        console.log(payload);
        var payloadData = JSON.parse(payload.body); // parse edilen payload okunabilir js nesnesine dönüştürülür
        if(privateChats.get(payloadData.senderName)){// eger eskiden konuşulduysa
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        }else{//konuşma öncesi yoksa
            let list =[];
            list.push(payloadData);
            privateChats.set(payloadData.senderName,list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);
        
    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message": value});
    }
    const sendValue=()=>{
            if (stompClient) {
              var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status:"MESSAGE"
              };
              console.log(chatMessage);
              stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
              setUserData({...userData,"message": ""});
            }
    }

    const sendPrivateValue=()=>{
        if (stompClient) {
          var chatMessage = {
            senderName: userData.username,
            receiverName:tab,
            message: userData.message,
            status:"MESSAGE"
          };
          
          if(userData.username !== tab){
            privateChats.get(tab).push(chatMessage);
            setPrivateChats(new Map(privateChats));
          }
          stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
          setUserData({...userData,"message": ""});
        }
    }

    const handleUsername=(event)=>{ // userdatayı klavyeden girilen yazı ile değiştirilir
        const {value}=event.target;
        setUserData({...userData,"username": value});
    }

    const registerUser=()=>{ // kullancı ilk ismini girince çalışan fonksiyon
        connect();
    }
    return (
    <div className="container">
        {userData.connected?
        <div className="chat-box">
            <div className="member-list">
                <ul>
                    <li onClick={()=>{setTab("CHATROOM")}} className={`member ${tab==="CHATROOM" && "active"}`}>Chatroom</li>
                    {[...privateChats.keys()].map((name,index)=>(
                        <li onClick={()=>{setTab(name)}} className={`member ${tab===name && "active"}`} key={index}>{name}</li>
                    ))}
                </ul>
            </div>
            {tab==="CHATROOM" && <div className="chat-content">
                <ul className="chat-messages">
                    {publicChats.map((chat,index)=>(
                        <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                            {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                            <div className="message-data">{chat.message}</div>
                            {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                        </li>
                    ))}
                </ul>

                <div className="send-message">
                    <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} /> 
                    <button type="button" className="send-button" onClick={sendValue}>send</button>
                </div>
            </div>}
            {tab!=="CHATROOM" && <div className="chat-content">
                <ul className="chat-messages">
                    {[...privateChats.get(tab)].map((chat,index)=>(
                        <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                            {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                            <div className="message-data">{chat.message}</div>
                            {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                        </li>
                    ))}
                </ul>

                <div className="send-message">
                    <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} /> 
                    <button type="button" className="send-button" onClick={sendPrivateValue}>send</button>
                </div>
            </div>}
        </div>
        :
        <div className="register">
            <input
                id="user-name"
                placeholder="Enter your name"
                name="userName"
                value={userData.username}
                onChange={handleUsername}
                margin="normal"
              />
              <button type="button" onClick={registerUser}>
                    connect
              </button> 
        </div>}
    </div>
    )
}

export default ChatRoom