package com.involveininnvation.chatserver.controller;
import com.involveininnvation.chatserver.model.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
@Controller
public class chatContoller {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message") //message gelen
    @SendTo("/chatroom/public") //chatroom/public e gider
    public Message receivePublicMessage(@Payload Message message){ //genel sohbet mesajlarını işler
        return message;//app/message

    }
    @MessageMapping("/private-message")
    public Message receivePrivateMessage(@Payload Message message){ // gelen datanın içersinden direkt mesajı çeker xml json filan neyse direkt o kısmı message değişkenine atar

        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(), "/private",message); //hangi kullanıcayı gidecigi seçilir ve message yollanır
        return message;//user/burhan/private
    }
}
/* 
Bu kontrolcü sınıfı, WebSocket üzerinden gelen mesajları işleyerek, genel sohbet odasına ve özel kullanıcılara mesajları yönlendirir.
SimpMessagingTemplate kullanılarak mesajların belirli hedeflere gönderilmesi sağlanır.
*/