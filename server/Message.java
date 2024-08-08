package com.involveininnvation.chatserver.model;

import lombok.*;

@Getter  // get methodlarını kullamak için
@Setter  // set methodlarını kullanmak için
@NoArgsConstructor // parametresiz constructor ekler
@ToString // direkt hepsini string olarak print etmek için
public class Message {
    private String senderName;
    private String receiverName;
    private String message;
    private String data;
    private Status status;
}
