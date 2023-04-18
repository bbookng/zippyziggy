package com.zippyziggy.member.service;

import com.zippyziggy.member.dto.request.MemberSignUpRequestDto;
import com.zippyziggy.member.model.JwtToken;
import com.zippyziggy.member.model.Member;
import com.zippyziggy.member.model.Platform;
import com.zippyziggy.member.model.RoleType;
import com.zippyziggy.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.NonUniqueResultException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private JwtProviderService jwtProviderService;

    @Autowired
    private JwtValidationService jwtValidationService;

    /**
     * 기존 회원인지 검증 서비스
     * @param platform: Kakao, Google
     * @param platformId: 각 플랫폼 아이디
     * @return boolean true, false
     */
    public Member memberCheck(Platform platform, String platformId) throws Exception {
        Optional<Member> member = memberRepository.findByPlatformAndPlatformId(platform, platformId);
        if (member.isEmpty()) {
            return null;
        } else {
            return member.get();
        }
    }

    /**
     * 회원가입
     * 유저가 이미 존재한다면 에러 발생
     */
    public JwtToken memberSignUp(MemberSignUpRequestDto dto) throws Exception {

        String nickname = dto.getNickname();

        Optional<Member> checkMember = memberRepository.findByNicknameEquals(nickname);
        System.out.println("dto = " + dto);
        if (checkMember.isEmpty()) {
            Member member = Member.builder()
                    .name(dto.getName())
                    .nickname(nickname)
                    .activate(true)
                    .role(RoleType.USER)
                    .platform(dto.getPlatform())
                    .platformId(dto.getPlatformId())
                    .profileImg(dto.getProfileImg())
                    .userUuid(UUID.randomUUID())
                    .build();
            System.out.println("member = " + member.getPlatform());
            System.out.println("member = " + member.getActivate());
            memberRepository.save(member);

            // 자동 로그인을 위해 JWT Token 부여
            Optional<Member> newMember = memberRepository.findByNicknameEquals(nickname);

            // Jwt 토큰 반환
            JwtToken jwtToken = jwtProviderService.createJwtToken(newMember.get().getUserUuid(), newMember.get().getNickname());
            // refreshToken DB 저장
            newMember.get().setRefreshToken(jwtToken.getRefreshToken());

            return jwtToken;

        } else {
            throw new NonUniqueResultException("유저가 이미 존재합니다.");
        }

    }

    /**
     * 닉네임 중복 검사
     */
    public boolean nicknameCheck(String nickname) throws Exception {
        Optional<Member> member = memberRepository.findByNicknameEquals(nickname);
        if (member.isEmpty()) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 회원탈퇴
     */
    public void memberSignOut(String accessToken) throws Exception {

        Member member = jwtValidationService.findMemberByJWT(accessToken);
        member.setActivate(false);

    }
}
