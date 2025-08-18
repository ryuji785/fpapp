package app.fp.infrastructure.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import app.fp.domain.category.Category;
import app.fp.domain.category.CategoryType;

@Mapper
public interface CategoryMapper {
    List<Category> findByParentType(@Param("type") CategoryType type);
}
