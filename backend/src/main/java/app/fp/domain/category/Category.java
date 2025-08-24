package app.fp.domain.category;

import lombok.Data;

@Data
public class Category {
    private Long id;
    private CategoryType type;
    private String name;
    private CategoryType parentType;
}
