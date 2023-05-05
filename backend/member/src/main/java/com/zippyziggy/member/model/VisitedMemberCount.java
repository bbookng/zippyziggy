package com.zippyziggy.member.model;

import lombok.*;

import javax.persistence.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "visited_member_count")
@Getter
@ToString
public class VisitedMemberCount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nowDate;
    private Long visitedCount;


    public void setVisitedCount(Long visitedCount) {
        this.visitedCount = visitedCount;
    }
}
