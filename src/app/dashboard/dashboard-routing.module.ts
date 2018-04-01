import {NgModule} from '@angular/core';
import {Routes, RouterModule, CanActivate} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {CompanyComponent} from './component/company/company.component';
import {CategoryComponent} from './component/category/category.component';
import {ProductComponent} from './component/product/product.component';
import {ModelComponent} from './component/model/model.component';
import {SerialComponent} from './component/serial/serial.component';
import {AccessoriesComponent} from './component/accessories/accessories.component';
import {AccountantComponent} from './component/accountant/accountant.component';
import {DocumentComponent} from './component/document/document.component';
import {DocumentsComponent} from './component/documents/documents.component';
import {RoleComponent} from './component/role/role.component';
import {ReceiptComponent} from './component/receipt/receipt.component';
import {IssueComponent} from './component/issue/issue.component';
import {RemovalComponent} from './component/removal/removal.component';
import {UserComponent} from './component/user/user.component';
import {ReceiptsComponent} from './component/receipts/receipts.component';
import {IssuesComponent} from './component/issues/issues.component';
import {RemovalsComponent} from './component/removals/removals.component';
import {CustomerComponent} from './component/customer/customer.component';
import {HpcallComponent} from './component/hpcall/hpcall.component';
import {InventoryComponent} from './component/inventory/inventory.component';
import {CenterComponent} from './component/center/center.component';
import {StationComponent} from './component/station/station.component';
import {LegalComponent} from './component/legal/legal.component';
import {CpdlComponent} from './component/cpdl/cpdl.component';
import {BtcscComponent} from './component/btcsc/btcsc.component';
import {TthtComponent} from './component/ttht/ttht.component';
import {CauseComponent} from './component/cause/cause.component';
import {SurmountComponent} from './component/surmount/surmount.component';
import {HpcallsnComponent} from './component/hpcallsn/hpcallsn.component';
import {HpcallsyComponent} from './component/hpcallsy/hpcallsy.component';
import {CreateOrderComponent} from './component/create-order/create-order.component';
import {DncvtComponent} from './component/dncvt/dncvt.component';
import {DsphieudnvtComponent} from './component/dsphieudnvt/dsphieudnvt.component';
import {OrdersComponent} from './component/orders/orders.component';
import { PhieuscComponent } from './component/phieusc/phieusc.component';
import {AccountComponent} from './component/account/account.component';
import {AddCustomerComponent} from './component/add-customer/add-customer.component';
import {ToChucResolverService} from '../shared/to-chuc-resolver.service';
import {PbhdscComponent} from './component/pbhdsc/pbhdsc.component';
import {PbhhtComponent} from './component/pbhht/pbhht.component';
import {DspscComponent} from './component/dspsc/dspsc.component';
import {InventoryoldComponent} from './component/inventoryold/inventoryold.component';
import {LinhkienxacComponent} from './component/linhkienxac/linhkienxac.component';
import { DsPhieuNhapKhoXacComponent } from './component/ds-phieu-nhap-kho-xac/ds-phieu-nhap-kho-xac.component';
import { DsPhieuXuatKhoXacComponent } from './component/ds-phieu-xuat-kho-xac/ds-phieu-xuat-kho-xac.component';
import { DsPhieuChuyenKhoXacComponent } from './component/ds-phieu-chuyen-kho-xac/ds-phieu-chuyen-kho-xac.component';
import { DsPhieuChuyenKhoThanhPhamComponent } from './component/ds-phieu-chuyen-kho-thanh-pham/ds-phieu-chuyen-kho-thanh-pham.component';
import { DsPhieuXuatKhoThanhPhamComponent } from './component/ds-phieu-xuat-kho-thanh-pham/ds-phieu-xuat-kho-thanh-pham.component';
import { DsPhieuNhapKhoThanhPhamComponent } from './component/ds-phieu-nhap-kho-thanh-pham/ds-phieu-nhap-kho-thanh-pham.component';
import {DscvctComponent} from './component/dscvct/dscvct.component';
import {PnkscComponent} from './component/pnksc/pnksc.component';
import { TdnlkComponent } from './component/tdnlk/tdnlk.component';
import { DskxcnkComponent } from './component/dskxcnk/dskxcnk.component';
import {AuthGuard} from '../shared/guard/auth.guard';
import { LenhNhanHangVeComponent } from './component/lenh-nhan-hang-ve/lenh-nhan-hang-ve.component';
import { LenhGhChoMuonTuComponent } from './component/lenh-gh-cho-muon-tu/lenh-gh-cho-muon-tu.component';
import { LenhGhXuatDoiBhComponent } from './component/lenh-gh-xuat-doi-bh/lenh-gh-xuat-doi-bh.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    resolve: {
      toChuc: ToChucResolverService
    },
    children: [
      {
        path: 'company',
        component: CompanyComponent
      },
      {
          path: 'category',
          component: CategoryComponent
      },
        {
            path: 'product',
            component: ProductComponent
        },
        {
            path: 'model',
            component: ModelComponent
        },
        {
            path: 'serial',
            component: SerialComponent
        },
        {
            path: 'accessories',
            component: AccessoriesComponent
        }
        ,
        {
            path: 'accountant',
            component: AccountantComponent
        }
        ,
        {
            path: 'document',
            component: DocumentComponent
        }
        ,
        {
            path: 'documents',
            component: DocumentsComponent
        }
        ,
        {
            path: 'role',
            component: RoleComponent
        }
        ,
        {
            path: 'receipt',
            component: ReceiptComponent
        }
        ,
        {
            path: 'receipts',
            component: ReceiptsComponent
        }
        ,
        {
            path: 'issue',
            component: IssueComponent
        },
        {
            path: 'issues',
            component: IssuesComponent
        }
        ,
        {
            path: 'removal',
            component: RemovalComponent
        },
        {
            path: 'removals',
            component: RemovalsComponent
        },
        {
            path: 'customer',
            component: CustomerComponent
        },
        {
            path: 'user',
            component: UserComponent
        }
        ,
        {
            path: 'hpcall',
            component: HpcallComponent
        }
        ,
        {
            path: 'ton-kho-linh-kien-tot',
            component: InventoryComponent
        }
        ,
        {
            path: 'center',
            component: CenterComponent
        }
        ,
        {
            path: 'station',
            component: StationComponent
        }
        ,
        {
            path: 'legal',
            component: LegalComponent
        }
        ,
        {
            path: 'chi-phi-di-lai',
            component: CpdlComponent
        }
        ,
        {
            path: 'dach-sach-bang-tinh-cong-sua-chua',
            component: BtcscComponent
        }
        ,
        {
            path: 'dach-sach-tinh-trang-hu-hong',
            component: TthtComponent
        }
        ,
        {
            path: 'dach-sach-nguyen-nhan',
            component: CauseComponent
        }
        ,
        {
            path: 'dach-sach-huong-khac-phuc',
            component: SurmountComponent
        }
        ,
        {
            path: 'dach-sach-happy-call-chua-thuc-hien',
            component: HpcallsnComponent
        }
        ,
        {
            path: 'dach-sach-happy-call-da-thuc-hien',
            component: HpcallsyComponent
        },
        {
            path: 'tao-don-dat-hang',
            component: CreateOrderComponent
        },
        {
            path: 'don-de-nghi-cap-vat-tu',
            component: DncvtComponent
        },
        {
          path: 'danh-sach-phieu-vat-tu',
          component: DsphieudnvtComponent
        },
        {
          path: 'danh-sach-don-dat-hang',
          component: OrdersComponent
        },
        {
          path: 'tao-phieu-sua-chua',
          component: PhieuscComponent
        },
        {
          path: 'account',
          component: AccountComponent
        },
        {
            path: 'add-customer',
            component: AddCustomerComponent
        },
        {
            path: 'phieu-bao-hanh-dang-sua-chua',
            component: PbhdscComponent
        },
        {
            path: 'phieu-bao-hanh-hoan-thanh',
            component: PbhhtComponent
        },
        {
            path: 'danh-sach-phieu-bao-hanh',
            component: DspscComponent
        },
        {
            path: 'ton-kho-linh-kien-xac',
            component: InventoryoldComponent
        },
        {
            path: 'tinh-trang-nhap-no-linh-kien-xac',
            component: LinhkienxacComponent
        },
        {
            path: 'ds-phieu-nhap-kho-xac',
            component: DsPhieuNhapKhoXacComponent
        },
        {
            path: 'ds-phieu-xuat-kho-xac',
            component: DsPhieuXuatKhoXacComponent
        },
        {
            path: 'ds-phieu-chuyen-kho-xac',
            component: DsPhieuChuyenKhoXacComponent
        },
        {
            path: 'ds-phieu-nhap-kho-thanh-pham',
            component: DsPhieuNhapKhoThanhPhamComponent
        },
        {
            path: 'ds-phieu-xuat-kho-thanh-pham',
            component: DsPhieuXuatKhoThanhPhamComponent
        },
        {
            path: 'ds-phieu-chuyen-kho-thanh-pham',
            component: DsPhieuChuyenKhoThanhPhamComponent
        },
        {
            path: 'phieu-nhap-kho-sua-chua',
            component: PnkscComponent
        },
        {
            path: 'danh-sach-cong-viec',
            component: DscvctComponent
        },
        {
            path: 'theo-doi-no-linh-kien',
            component: TdnlkComponent
        },
        {
            path: 'danh-sach-kho-xac-cho-nhap-kho',
            component: DskxcnkComponent
        },
        {
          path: 'lenh-nhanh-hang-ve',
          component: LenhNhanHangVeComponent
        },
        {
            path: 'lenh-giao-hang-cho-muon-tu',
            component: LenhGhChoMuonTuComponent
        },
        {
            path: 'lenh-giao-hang-xuat-doi-bao-hanh',
            component: LenhGhXuatDoiBhComponent
        },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
