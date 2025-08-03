package com.example.fpapp.repository;

import com.example.fpapp.domain.FixedCost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FixedCostRepository extends JpaRepository<FixedCost, Long> {
}
