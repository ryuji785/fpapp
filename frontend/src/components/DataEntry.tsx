import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  CalendarIcon, 
  Upload, 
  Save, 
  Plus,
  Wallet,
  TrendingDown,
  ArrowLeftRight,
  CreditCard,
  Smartphone,
  Building,
  AlertCircle
} from 'lucide-react';
import { cn } from './ui/utils';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { toast } from 'sonner@2.0.3';

// マスタデータ（後で設定画面で管理）
const CATEGORIES = {
  income: ['給与', '賞与', '副業', '投資', 'その他収入'],
  expense: ['食費', '住居費', '交通費', '光熱費', '通信費', '保険', '医療費', '教育費', '娯楽費', 'その他支出'],
  savings: ['普通預金', '定期預金', '投資信託', '株式', 'その他貯蓄']
};

const PAYMENT_METHODS = ['現金', 'クレジットカード', 'デビットカード', '電子マネー', '銀行振込', '口座振替'];

const CARD_TYPES = ['楽天カード', 'イオンカード', 'Amazon Mastercard', 'JCBカード', '三井住友カード', 'その他'];

const EMONEY_TYPES = ['Suica', 'PASMO', 'nanaco', 'WAON', 'PayPay', 'LINE Pay', 'その他'];

const ACCOUNTS = ['メイン口座', 'サブ口座', '貯蓄口座', '投資口座'];

export function DataEntry() {
  const [transactionType, setTransactionType] = useState<'income' | 'expense' | 'savings'>('expense');
  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardType, setCardType] = useState('');
  const [emoneyType, setEmoneyType] = useState('');
  const [account, setAccount] = useState('');
  const [fromAccount, setFromAccount] = useState(''); // 貯蓄の振替元
  const [toAccount, setToAccount] = useState(''); // 貯蓄の振替先
  const [memo, setMemo] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // バリデーション
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = '金額を入力してください（0より大きい値）';
    }

    if (!category) {
      newErrors.category = 'カテゴリを選択してください';
    }

    if (transactionType === 'income' && !account) {
      newErrors.account = '入金口座を選択してください';
    }

    if (transactionType === 'expense' && !paymentMethod) {
      newErrors.paymentMethod = '支払い方法を選択してください';
    }

    if (transactionType === 'savings') {
      if (!fromAccount) {
        newErrors.fromAccount = '振替元口座を選択してください';
      }
      if (!toAccount) {
        newErrors.toAccount = '振替先口座を選択してください';
      }
      if (fromAccount === toAccount) {
        newErrors.toAccount = '振替元と振替先は異なる口座を選択してください';
      }
    }

    if ((paymentMethod === 'クレジットカード' || paymentMethod === 'デビットカード') && !cardType) {
      newErrors.cardType = 'カード種別を選択してください';
    }

    if (paymentMethod === '電子マネー' && !emoneyType) {
      newErrors.emoneyType = '電子マネー種別を選択してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 保存処理
  const handleSave = () => {
    if (!validateForm()) {
      toast.error('入力内容に不備があります');
      return;
    }

    // TODO: 実際の保存処理
    const transaction = {
      type: transactionType,
      date: format(date, 'yyyy-MM-dd'),
      amount: parseFloat(amount),
      category,
      paymentMethod: transactionType === 'income' ? account : paymentMethod,
      cardType: cardType || undefined,
      emoneyType: emoneyType || undefined,
      fromAccount: fromAccount || undefined,
      toAccount: toAccount || undefined,
      memo,
      receipt: receipt?.name || undefined
    };

    console.log('Transaction:', transaction);
    toast.success('取引を保存しました');

    // フォームリセット
    setAmount('');
    setCategory('');
    setPaymentMethod('');
    setCardType('');
    setEmoneyType('');
    setAccount('');
    setFromAccount('');
    setToAccount('');
    setMemo('');
    setReceipt(null);
    setErrors({});
  };

  // 種別変更時の初期化
  const handleTypeChange = (newType: 'income' | 'expense' | 'savings') => {
    setTransactionType(newType);
    setCategory('');
    setPaymentMethod('');
    setCardType('');
    setEmoneyType('');
    setAccount('');
    setFromAccount('');
    setToAccount('');
    setErrors({});
  };

  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 種別選択 - カードボタン形式 */}
        <Card>
          <CardHeader>
            <CardTitle>取引種別</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant={transactionType === 'income' ? 'default' : 'outline'}
                onClick={() => handleTypeChange('income')}
                className="h-20 flex-col gap-2"
              >
                <Wallet className="h-6 w-6" />
                <span>収入</span>
              </Button>
              <Button
                variant={transactionType === 'expense' ? 'default' : 'outline'}
                onClick={() => handleTypeChange('expense')}
                className="h-20 flex-col gap-2"
              >
                <TrendingDown className="h-6 w-6" />
                <span>支出</span>
              </Button>
              <Button
                variant={transactionType === 'savings' ? 'default' : 'outline'}
                onClick={() => handleTypeChange('savings')}
                className="h-20 flex-col gap-2"
              >
                <ArrowLeftRight className="h-6 w-6" />
                <span>貯蓄</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 基本情報入力 */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 日付 */}
            <div className="space-y-2">
              <Label htmlFor="date">取引日 <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'yyyy/MM/dd', { locale: ja }) : '日付を選択'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 金額 */}
            <div className="space-y-2">
              <Label htmlFor="amount">金額 <span className="text-red-500">*</span></Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">¥</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    if (errors.amount) {
                      setErrors(prev => ({ ...prev, amount: '' }));
                    }
                  }}
                  className={cn("pl-8", errors.amount && "border-red-500")}
                />
              </div>
              {errors.amount && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="h-3 w-3" />
                  {errors.amount}
                </div>
              )}
            </div>

            {/* カテゴリ */}
            <div className="space-y-2">
              <Label htmlFor="category">カテゴリ <span className="text-red-500">*</span></Label>
              <Select value={category} onValueChange={(value) => {
                setCategory(value);
                if (errors.category) {
                  setErrors(prev => ({ ...prev, category: '' }));
                }
              }}>
                <SelectTrigger className={cn(errors.category && "border-red-500")}>
                  <SelectValue placeholder="カテゴリを選択" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES[transactionType].map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="h-3 w-3" />
                  {errors.category}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 支払い・口座情報 */}
        <Card>
          <CardHeader>
            <CardTitle>
              {transactionType === 'income' ? '入金先' : 
               transactionType === 'savings' ? '振替先' : '支払い方法'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {transactionType === 'income' && (
              <div className="space-y-2">
                <Label htmlFor="account">入金口座 <span className="text-red-500">*</span></Label>
                <Select value={account} onValueChange={(value) => {
                  setAccount(value);
                  if (errors.account) {
                    setErrors(prev => ({ ...prev, account: '' }));
                  }
                }}>
                  <SelectTrigger className={cn(errors.account && "border-red-500")}>
                    <SelectValue placeholder="口座を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCOUNTS.map((acc) => (
                      <SelectItem key={acc} value={acc}>{acc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.account && (
                  <div className="flex items-center gap-1 text-red-500 text-sm">
                    <AlertCircle className="h-3 w-3" />
                    {errors.account}
                  </div>
                )}
              </div>
            )}

            {transactionType === 'expense' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">支払い方法 <span className="text-red-500">*</span></Label>
                  <Select value={paymentMethod} onValueChange={(value) => {
                    setPaymentMethod(value);
                    setCardType(''); // リセット
                    setEmoneyType(''); // リセット
                    if (errors.paymentMethod) {
                      setErrors(prev => ({ ...prev, paymentMethod: '' }));
                    }
                  }}>
                    <SelectTrigger className={cn(errors.paymentMethod && "border-red-500")}>
                      <SelectValue placeholder="支払い方法を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((method) => (
                        <SelectItem key={method} value={method}>
                          <div className="flex items-center gap-2">
                            {method === 'クレジットカード' || method === 'デビットカード' ? (
                              <CreditCard className="h-4 w-4" />
                            ) : method === '電子マネー' ? (
                              <Smartphone className="h-4 w-4" />
                            ) : (
                              <Building className="h-4 w-4" />
                            )}
                            {method}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.paymentMethod && (
                    <div className="flex items-center gap-1 text-red-500 text-sm">
                      <AlertCircle className="h-3 w-3" />
                      {errors.paymentMethod}
                    </div>
                  )}
                </div>

                {/* カード種別（クレジット・デビット選択時） */}
                {(paymentMethod === 'クレジットカード' || paymentMethod === 'デビットカード') && (
                  <div className="space-y-2">
                    <Label htmlFor="cardType">カード種別 <span className="text-red-500">*</span></Label>
                    <Select value={cardType} onValueChange={(value) => {
                      setCardType(value);
                      if (errors.cardType) {
                        setErrors(prev => ({ ...prev, cardType: '' }));
                      }
                    }}>
                      <SelectTrigger className={cn(errors.cardType && "border-red-500")}>
                        <SelectValue placeholder="カード種別を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {CARD_TYPES.map((card) => (
                          <SelectItem key={card} value={card}>
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              {card}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.cardType && (
                      <div className="flex items-center gap-1 text-red-500 text-sm">
                        <AlertCircle className="h-3 w-3" />
                        {errors.cardType}
                      </div>
                    )}
                  </div>
                )}

                {/* 電子マネー種別 */}
                {paymentMethod === '電子マネー' && (
                  <div className="space-y-2">
                    <Label htmlFor="emoneyType">電子マネー種別 <span className="text-red-500">*</span></Label>
                    <Select value={emoneyType} onValueChange={(value) => {
                      setEmoneyType(value);
                      if (errors.emoneyType) {
                        setErrors(prev => ({ ...prev, emoneyType: '' }));
                      }
                    }}>
                      <SelectTrigger className={cn(errors.emoneyType && "border-red-500")}>
                        <SelectValue placeholder="電子マネー種別を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {EMONEY_TYPES.map((emoney) => (
                          <SelectItem key={emoney} value={emoney}>
                            <div className="flex items-center gap-2">
                              <Smartphone className="h-4 w-4" />
                              {emoney}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.emoneyType && (
                      <div className="flex items-center gap-1 text-red-500 text-sm">
                        <AlertCircle className="h-3 w-3" />
                        {errors.emoneyType}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {transactionType === 'savings' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fromAccount">振替元口座 <span className="text-red-500">*</span></Label>
                  <Select value={fromAccount} onValueChange={(value) => {
                    setFromAccount(value);
                    if (errors.fromAccount) {
                      setErrors(prev => ({ ...prev, fromAccount: '' }));
                    }
                  }}>
                    <SelectTrigger className={cn(errors.fromAccount && "border-red-500")}>
                      <SelectValue placeholder="振替元口座を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACCOUNTS.map((acc) => (
                        <SelectItem key={acc} value={acc}>{acc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.fromAccount && (
                    <div className="flex items-center gap-1 text-red-500 text-sm">
                      <AlertCircle className="h-3 w-3" />
                      {errors.fromAccount}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toAccount">振替先口座 <span className="text-red-500">*</span></Label>
                  <Select value={toAccount} onValueChange={(value) => {
                    setToAccount(value);
                    if (errors.toAccount) {
                      setErrors(prev => ({ ...prev, toAccount: '' }));
                    }
                  }}>
                    <SelectTrigger className={cn(errors.toAccount && "border-red-500")}>
                      <SelectValue placeholder="振替先口座を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACCOUNTS.map((acc) => (
                        <SelectItem key={acc} value={acc}>{acc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.toAccount && (
                    <div className="flex items-center gap-1 text-red-500 text-sm">
                      <AlertCircle className="h-3 w-3" />
                      {errors.toAccount}
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* メモ・添付ファイル */}
        <Card>
          <CardHeader>
            <CardTitle>詳細情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="memo">メモ</Label>
              <Textarea
                id="memo"
                placeholder="取引の詳細やメモを入力"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receipt">領収書・レシート</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="receipt"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('receipt')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  ファイルを選択
                </Button>
                {receipt && (
                  <Badge variant="secondary">{receipt.name}</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 保存ボタン */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => {
            // リセット処理
            setAmount('');
            setCategory('');
            setPaymentMethod('');
            setCardType('');
            setEmoneyType('');
            setAccount('');
            setFromAccount('');
            setToAccount('');
            setMemo('');
            setReceipt(null);
            setErrors({});
          }}>
            リセット
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            保存
          </Button>
        </div>
      </div>
    </div>
  );
}