package app.fp.household;

import java.time.LocalDate;

import lombok.Data;

@Data
public class FamilyMember {
    private Long id;
    private Long householdId;
    private String name;
    private String relationship;
    private LocalDate birthDate;
    private String gender;
    private String employmentStatus;
    private Integer schoolStartAge;
    private Integer retirementAge;
    private String memo;
}
