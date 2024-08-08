package com.involveininnvation.chatserver.model;

import lombok.*;

@Getter  
@Setter 
@NoArgsConstructor 
@ToString 
public class Message {
    private String senderName;
    private String receiverName;
    private String message;
    private String data;
    private Status status;
}
