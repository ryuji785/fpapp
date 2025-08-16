import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { User, Plus, Edit, Trash2, Users, Calendar, Briefcase, Clock, GraduationCap } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface FamilyMember {
  id: number;
  name: string;
  relationship: '本人' | '配偶者' | '子' | 'その他';
  birthDate: string;
  gender?: '男性' | '女性';
  employmentStatus?: '就業中' | '学生' | '無職' | 'その他';
  memo?: string;
  schoolStartAge?: number; // 小1開始年齢（既定6歳）
  retirementAge?: number; // 退職年齢（既定65歳）
}

// サンプルデータ
const initialFamilyMembers: FamilyMember[] = [
  {
    id: 1,
    name: '田中 太郎',
    relationship: '本人',
    birthDate: '1990-04-15',
    gender: '男性',
    employmentStatus: '就業中',
    retirementAge: 65,
    memo: ''
  },
  {
    id: 2,
    name: '田中 花子',
    relationship: '配偶者',
    birthDate: '1992-08-22',
    gender: '女性',
    employmentStatus: '就業中',
    retirementAge: 65,
    memo: ''
  },
  {
    id: 3,
    name: '田中 一郎',
    relationship: '子',
    birthDate: '2020-03-10',
    gender: '男性',
    employmentStatus: '学生',
    schoolStartAge: 6,
    memo: '長男'
  }
];

export function FamilyManagement() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [formData, setFormData] = useState<Partial<FamilyMember>>({
    name: '',
    relationship: '本人',
    birthDate: '',
    gender: undefined,
    employmentStatus: undefined,
    memo: '',
    schoolStartAge: 6,
    retirementAge: 65
  });

  // 年齢計算
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // 学年計算（4月1日基準）
  const calculateSchoolGrade = (birthDate: string, schoolStartAge: number = 6): string => {
    const birth = new Date(birthDate);
    const today = new Date();
    const currentYear = today.getFullYear();
    const schoolStartYear = birth.getFullYear() + schoolStartAge;
    
    // 4月1日基準で学年を調整
    const isAfterApril = today.getMonth() >= 3; // 4月以降
    let adjustedCurrentYear = currentYear;
    if (!isAfterApril) {
      adjustedCurrentYear = currentYear - 1;
    }
    
    const grade = adjustedCurrentYear - schoolStartYear + 1;
    
    if (grade < 1) return '就学前';
    if (grade <= 6) return `小学${grade}年`;
    if (grade <= 9) return `中学${grade - 6}年`;
    if (grade <= 12) return `高校${grade - 9}年`;
    if (grade <= 16) return `大学${grade - 12}年`;
    return '卒業済み';
  };

  // 退職までの年数計算
  const calculateYearsToRetirement = (birthDate: string, retirementAge: number = 65): number | null => {
    const age = calculateAge(birthDate);
    return retirementAge > age ? retirementAge - age : null;
  };

  // 次回進学イベントまでの年数計算
  const calculateYearsToNextSchoolEvent = (birthDate: string, schoolStartAge: number = 6): { event: string; years: number } | null => {
    const birth = new Date(birthDate);
    const currentYear = new Date().getFullYear();
    const schoolStartYear = birth.getFullYear() + schoolStartAge;
    
    const events = [
      { name: '小学校入学', year: schoolStartYear },
      { name: '中学校入学', year: schoolStartYear + 6 },
      { name: '高校入学', year: schoolStartYear + 9 },
      { name: '大学入学', year: schoolStartYear + 12 }
    ];
    
    for (const event of events) {
      if (event.year > currentYear) {
        return {
          event: event.name,
          years: event.year - currentYear
        };
      }
    }
    
    return null;
  };

  // 扶養人数計算（18歳未満）
  const getDependentCount = (): number => {
    return familyMembers.filter(member => {
      const age = calculateAge(member.birthDate);
      return age < 18 && member.relationship === '子';
    }).length;
  };

  // 就学者数計算
  const getStudentCount = (): number => {
    return familyMembers.filter(member => member.employmentStatus === '学生').length;
  };

  // 未就学者数計算
  const getPreschoolCount = (): number => {
    return familyMembers.filter(member => {
      if (member.relationship !== '子') return false;
      const grade = calculateSchoolGrade(member.birthDate, member.schoolStartAge);
      return grade === '就学前';
    }).length;
  };

  // 最も近い重要イベント
  const getNextImportantEvent = () => {
    let nextEvent = null;
    let minYears = Infinity;

    familyMembers.forEach(member => {
      // 進学イベント
      if (member.relationship === '子') {
        const schoolEvent = calculateYearsToNextSchoolEvent(member.birthDate, member.schoolStartAge);
        if (schoolEvent && schoolEvent.years < minYears) {
          nextEvent = {
            type: '進学',
            description: `${member.name}の${schoolEvent.event}`,
            years: schoolEvent.years
          };
          minYears = schoolEvent.years;
        }
      }
      
      // 退職イベント
      if (member.relationship === '本人' || member.relationship === '配偶者') {
        const retirementYears = calculateYearsToRetirement(member.birthDate, member.retirementAge);
        if (retirementYears && retirementYears < minYears) {
          nextEvent = {
            type: '退職',
            description: `${member.name}の退職`,
            years: retirementYears
          };
          minYears = retirementYears;
        }
      }
    });

    return nextEvent;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.relationship || !formData.birthDate) {
      toast.error('必須項目を入力してください');
      return;
    }

    const newMember: FamilyMember = {
      id: editingMember ? editingMember.id : Date.now(),
      name: formData.name!,
      relationship: formData.relationship as any,
      birthDate: formData.birthDate!,
      gender: formData.gender,
      employmentStatus: formData.employmentStatus,
      memo: formData.memo || '',
      schoolStartAge: formData.schoolStartAge || 6,
      retirementAge: formData.retirementAge || 65
    };

    if (editingMember) {
      setFamilyMembers(prev => prev.map(member => 
        member.id === editingMember.id ? newMember : member
      ));
      toast.success('家族情報を更新しました');
    } else {
      setFamilyMembers(prev => [...prev, newMember]);
      toast.success('家族を追加しました');
    }

    handleCloseDialog();
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingMember(member);
    setFormData(member);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setFamilyMembers(prev => prev.filter(member => member.id !== id));
    toast.success('家族情報を削除しました');
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMember(null);
    setFormData({
      name: '',
      relationship: '本人',
      birthDate: '',
      gender: undefined,
      employmentStatus: undefined,
      memo: '',
      schoolStartAge: 6,
      retirementAge: 65
    });
  };

  const nextEvent = getNextImportantEvent();

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-foreground">家族情報管理</h1>
            <p className="text-sm text-muted-foreground mt-1">世帯構成と各メンバーの基本情報を管理します</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                家族を追加
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingMember ? '家族情報編集' : '新しい家族を追加'}</DialogTitle>
                <DialogDescription>
                  家族の基本情報を入力してください。年齢は自動計算されます。
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">氏名 *</Label>
                  <Input
                    id="name"
                    placeholder="例: 田中 太郎"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relationship">続柄 *</Label>
                  <Select value={formData.relationship} onValueChange={(value) => handleInputChange('relationship', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="続柄を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="本人">本人</SelectItem>
                      <SelectItem value="配偶者">配偶者</SelectItem>
                      <SelectItem value="子">子</SelectItem>
                      <SelectItem value="その他">その他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">生年月日 *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  />
                  {formData.birthDate && (
                    <p className="text-sm text-muted-foreground">
                      現在 {calculateAge(formData.birthDate)} 歳
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">性別</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="性別を選択（任意）" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="男性">男性</SelectItem>
                      <SelectItem value="女性">女性</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">就業状況</Label>
                  <Select value={formData.employmentStatus} onValueChange={(value) => handleInputChange('employmentStatus', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="就業状況を選択（任意）" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="就業中">就業中</SelectItem>
                      <SelectItem value="学生">学生</SelectItem>
                      <SelectItem value="無職">無職</SelectItem>
                      <SelectItem value="その他">その他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.relationship === '子' && (
                  <div className="space-y-2">
                    <Label htmlFor="schoolStartAge">小学校入学年齢</Label>
                    <Input
                      id="schoolStartAge"
                      type="number"
                      min="5"
                      max="8"
                      value={formData.schoolStartAge}
                      onChange={(e) => handleInputChange('schoolStartAge', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                      既定値は6歳（4月1日基準）
                    </p>
                  </div>
                )}

                {(formData.relationship === '本人' || formData.relationship === '配偶者') && (
                  <div className="space-y-2">
                    <Label htmlFor="retirementAge">退職年齢</Label>
                    <Input
                      id="retirementAge"
                      type="number"
                      min="50"
                      max="80"
                      value={formData.retirementAge}
                      onChange={(e) => handleInputChange('retirementAge', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                      既定値は65歳
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="memo">メモ</Label>
                  <Textarea
                    id="memo"
                    placeholder="補足情報があれば入力してください"
                    className="resize-none"
                    rows={2}
                    value={formData.memo}
                    onChange={(e) => handleInputChange('memo', e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  キャンセル
                </Button>
                <Button onClick={handleSave}>
                  {editingMember ? '更新' : '追加'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左側: サマリー情報（改修済み） */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  世帯構成サマリ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-sm text-primary mb-1">総人数</div>
                    <div className="text-xl font-semibold text-primary">{familyMembers.length}</div>
                  </div>
                  
                  <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-sm text-orange-600 mb-1">扶養人数</div>
                    <div className="text-xl font-semibold text-orange-700">{getDependentCount()}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>就学者</span>
                    <span className="font-medium">{getStudentCount()}人</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>未就学者</span>
                    <span className="font-medium">{getPreschoolCount()}人</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>就業者</span>
                    <span className="font-medium">
                      {familyMembers.filter(m => m.employmentStatus === '就業中').length}人
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 重要カウントダウン */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  重要カウントダウン
                </CardTitle>
              </CardHeader>
              <CardContent>
                {nextEvent ? (
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-600 mb-2">{nextEvent.type}</div>
                    <div className="font-semibold text-blue-700 mb-1">あと{nextEvent.years}年</div>
                    <div className="text-xs text-blue-600">{nextEvent.description}</div>
                  </div>
                ) : (
                  <div className="text-center p-4 text-muted-foreground">
                    <GraduationCap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">予定されているイベントはありません</p>
                  </div>
                )}
                
                {/* その他の近い予定 */}
                <div className="mt-4 space-y-2">
                  {familyMembers.map(member => {
                    const events = [];
                    
                    if (member.relationship === '子') {
                      const schoolEvent = calculateYearsToNextSchoolEvent(member.birthDate, member.schoolStartAge);
                      if (schoolEvent && (nextEvent?.years !== schoolEvent.years || nextEvent?.description !== `${member.name}の${schoolEvent.event}`)) {
                        events.push({
                          name: member.name,
                          event: schoolEvent.event,
                          years: schoolEvent.years
                        });
                      }
                    }
                    
                    if (member.relationship === '本人' || member.relationship === '配偶者') {
                      const retirementYears = calculateYearsToRetirement(member.birthDate, member.retirementAge);
                      if (retirementYears && retirementYears > 0 && (nextEvent?.years !== retirementYears || nextEvent?.description !== `${member.name}の退職`)) {
                        events.push({
                          name: member.name,
                          event: '退職',
                          years: retirementYears
                        });
                      }
                    }
                    
                    return events.map((event, index) => (
                      <div key={`${member.id}-${index}`} className="flex justify-between items-center text-sm">
                        <span>{event.name}</span>
                        <div className="text-right">
                          <div className="font-medium">{event.event}</div>
                          <div className="text-xs text-muted-foreground">あと{event.years}年</div>
                        </div>
                      </div>
                    ));
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右側: 家族一覧 */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  家族一覧
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {familyMembers.map((member) => {
                    const age = calculateAge(member.birthDate);
                    const isChild = member.relationship === '子';
                    const isWorking = member.relationship === '本人' || member.relationship === '配偶者';
                    
                    return (
                      <div 
                        key={member.id} 
                        className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{member.name}</h4>
                            <Badge variant="outline" className="mt-1">
                              {member.relationship}
                            </Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(member)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(member.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>{age}歳</span>
                            {member.gender && (
                              <span className="text-muted-foreground">（{member.gender}）</span>
                            )}
                          </div>
                          
                          {member.employmentStatus && (
                            <div className="flex items-center gap-2 text-sm">
                              <Briefcase className="h-3 w-3 text-muted-foreground" />
                              <span>{member.employmentStatus}</span>
                            </div>
                          )}
                          
                          {isChild && (
                            <div className="text-sm text-muted-foreground">
                              学年: {calculateSchoolGrade(member.birthDate, member.schoolStartAge)}
                            </div>
                          )}
                          
                          {isWorking && member.retirementAge && (
                            <div className="text-sm text-muted-foreground">
                              退職予定: {member.retirementAge}歳
                              {calculateYearsToRetirement(member.birthDate, member.retirementAge) && (
                                <span className="ml-1">
                                  （あと{calculateYearsToRetirement(member.birthDate, member.retirementAge)}年）
                                </span>
                              )}
                            </div>
                          )}
                          
                          {member.memo && (
                            <div className="text-sm text-muted-foreground border-t pt-2 mt-2">
                              {member.memo}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {familyMembers.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>まだ家族が登録されていません</p>
                      <p className="text-sm">「家族を追加」ボタンから登録してください</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}