import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';

export function Settings() {
  return (
    <div className="h-full p-4 space-y-6">
      <h2 className="text-xl font-semibold">設定</h2>

      {/* Profile Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">プロフィール設定</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">ユーザー名</Label>
              <Input id="username" defaultValue="User" />
            </div>
            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <Input id="email" type="email" defaultValue="user@example.com" />
            </div>
          </div>
        </div>
      </Card>

      {/* Display Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">表示設定</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>ダークモード</Label>
              <p className="text-sm text-gray-600">ダークテーマを使用する</p>
            </div>
            <Switch />
          </div>
          
          <div>
            <Label htmlFor="currency">通貨表示</Label>
            <Select defaultValue="jpy">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jpy">日本円 (¥)</SelectItem>
                <SelectItem value="usd">米ドル ($)</SelectItem>
                <SelectItem value="eur">ユーロ (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Budget Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">予算設定</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="monthlyBudget">月間予算</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
              <Input
                id="monthlyBudget"
                type="number"
                className="pl-8"
                defaultValue="350000"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>予算アラート</Label>
              <p className="text-sm text-gray-600">予算の80%に達したら通知する</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">データ管理</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>自動バックアップ</Label>
              <p className="text-sm text-gray-600">データを自動的にバックアップする</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline">データをエクスポート</Button>
            <Button variant="outline">データをインポート</Button>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-[#2E7D32] hover:bg-[#1B5E20]">
          設定を保存
        </Button>
      </div>
    </div>
  );
}