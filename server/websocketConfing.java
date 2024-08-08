package com.involveininnvation.chatserver.confing;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class websocketConfing implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
    registry.setApplicationDestinationPrefixes("/app"); //app destionation prefix
    registry.enableSimpleBroker("/chatroom","/user"); // topic prefix
    registry.setUserDestinationPrefix("/user"); // user destinaion prefix
	
	/*
	Bu yapılandırma, uygulamanın STOMP protokolünü kullanarak WebSocket üzerinden iletişim kurmasını sağlar.
	/app öneki ile belirtilen hedeflere gönderilen mesajlar uygulama tarafından işlenirken, /chatroom ve /user hedeflerine 
	yönlendirilen mesajlar basit bir broker üzerinden ilgili istemcilere iletilir. registry.setUserDestinationPrefix("/user"); 
	satırı ise belirli kullanıcılara yönlendirilen mesajların hedefini belirler.
	*/
    }

    @Override

    public void registerStompEndpoints(StompEndpointRegistry registry) {
       registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
	   #websocket endpoint ekliyor /ws  
	   #"*"* tüm kaynaklardan gelen isteklere izin veriyoruz
	   #websocket çalışmayan sistemler için emülasyon katmanı ekliyor sockjs üzerinden
	   
	   /* Bu kod, registerStompEndpoints metodunu kullanarak bir WebSocket endpoint'i ekler
	   ve bu endpoint üzerinden STOMP protokolü ile iletişim kurulmasını sağlar. Ayrıca,
	   withSockJS() metodu sayesinde SockJS desteği eklenir, böylece tarayıcıların
	   WebSocket protokolünü desteklememesi durumunda dahi iletişim kurulabilir hale gelir.*/
	   
    }
}
