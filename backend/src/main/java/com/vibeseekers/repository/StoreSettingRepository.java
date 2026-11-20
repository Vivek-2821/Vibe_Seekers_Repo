package com.vibeseekers.repository;

import com.vibeseekers.entity.StoreSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StoreSettingRepository extends JpaRepository<StoreSetting, Long> {
    Optional<StoreSetting> findBySettingKey(String settingKey);
    boolean existsBySettingKey(String settingKey);
}
