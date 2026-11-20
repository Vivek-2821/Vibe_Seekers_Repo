package com.vibeseekers;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class VibeSeekersApplication {

    public static void main(String[] args) {// */
        SpringApplication.run(VibeSeekersApplication.class, args);
    }
}
