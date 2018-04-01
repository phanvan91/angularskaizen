import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {CompanyComponent} from './component/company/company.component';
import {CategoryComponent} from './component/category/category.component';
import {ProductComponent} from './component/product/product.component';
import {ModelComponent} from './component/model/model.component';
import {SerialComponent} from './component/serial/serial.component';
import {HeaderComponent} from './component/header/header.component';
import {AccessoriesComponent} from './component/accessories/accessories.component';
import {AccountantComponent} from './component/accountant/accountant.component';
import {DocumentComponent} from './component/document/document.component';
import {DocumentsComponent} from './component/documents/documents.component';
import {RoleComponent} from './component/role/role.component';
import {ReceiptComponent} from './component/receipt/receipt.component';
import {Select2Module} from 'ng2-select2';
import { IssueComponent } from './component/issue/issue.component';
import { RemovalComponent } from './component/removal/removal.component';
import { UserComponent } from './component/user/user.component';
import { CustomerComponent } from './component/customer/customer.component';
import { IssuesComponent } from './component/issues/issues.component';
import { ReceiptsComponent } from './component/receipts/receipts.component';
import { RemovalsComponent } from './component/removals/removals.component';
import { HpcallComponent } from './component/hpcall/hpcall.component';
import { InventoryComponent } from './component/inventory/inventory.component';
import { CenterComponent } from './component/center/center.component';
import { StationComponent } from './component/station/station.component';
import { LegalComponent } from './component/legal/legal.component';
import { CpdlComponent } from './component/cpdl/cpdl.component';
import { SurmountComponent } from './component/surmount/surmount.component';
import { CauseComponent } from './component/cause/cause.component';
import { TthtComponent } from './component/ttht/ttht.component';
import { BtcscComponent } from './component/btcsc/btcsc.component';
import { HpcallsyComponent } from './component/hpcallsy/hpcallsy.component';
import { HpcallsnComponent } from './component/hpcallsn/hpcallsn.component';
import {HttpClientModule} from '@angular/common/http';
import { CreateOrderComponent } from './component/create-order/create-order.component';
import { DncvtComponent } from './component/dncvt/dncvt.component';
import { DsphieudnvtComponent } from './component/dsphieudnvt/dsphieudnvt.component';
import { OrdersComponent } from './component/orders/orders.component';
import {BsDatepickerModule} from 'ngx-bootstrap';
import { PhieuscComponent } from './component/phieusc/phieusc.component';
import {SharedModule} from '../shared/shared.module';
import { AccountComponent } from './component/account/account.component';
import { LegalCreateComponent } from './component/legal/legal-create/legal-create.component';
import { AddCustomerComponent } from './component/add-customer/add-customer.component';
import {SelectModule} from 'ng2-select';
import { TthtCreateComponent } from './component/ttht/ttht-create/ttht-create.component';
import { CauseCreateComponent } from './component/cause/cause-create/cause-create.component';
import { SurmountCreateComponent } from './component/surmount/surmount-create/surmount-create.component';
import { CustomerEditComponent } from './component/customer/customer-edit/customer-edit.component';
import { SerialEditComponent } from './component/serial/serial-edit/serial-edit.component';
import { SerialCreateComponent } from './component/serial/serial-create/serial-create.component';
import { PbhdscComponent } from './component/pbhdsc/pbhdsc.component';
import { PbhhtComponent } from './component/pbhht/pbhht.component';

import { DspscComponent } from './component/dspsc/dspsc.component';
import { HpcallActionComponent } from './component/phieusc/hpcall-action/hpcall-action.component';
import { InventoryoldComponent } from './component/inventoryold/inventoryold.component';
import { LinhkienxacComponent } from './component/linhkienxac/linhkienxac.component';
import { DsPhieuNhapKhoXacComponent } from './component/ds-phieu-nhap-kho-xac/ds-phieu-nhap-kho-xac.component';
import { DsPhieuXuatKhoXacComponent } from './component/ds-phieu-xuat-kho-xac/ds-phieu-xuat-kho-xac.component';
import { DsPhieuChuyenKhoXacComponent } from './component/ds-phieu-chuyen-kho-xac/ds-phieu-chuyen-kho-xac.component';
import { DsPhieuChuyenKhoThanhPhamComponent } from './component/ds-phieu-chuyen-kho-thanh-pham/ds-phieu-chuyen-kho-thanh-pham.component';
import { DsPhieuXuatKhoThanhPhamComponent } from './component/ds-phieu-xuat-kho-thanh-pham/ds-phieu-xuat-kho-thanh-pham.component';
import { DsPhieuNhapKhoThanhPhamComponent } from './component/ds-phieu-nhap-kho-thanh-pham/ds-phieu-nhap-kho-thanh-pham.component';
import { PnkscComponent } from './component/pnksc/pnksc.component';
import {AccountantCreateComponent} from './component/accountant/accountant-create.component';
import { CustomerCreateComponent } from './component/serial/customer-create/customer-create.component';
import { DscvctComponent } from './component/dscvct/dscvct.component';
import { TdnlkComponent } from './component/tdnlk/tdnlk.component';
import { DskxcnkComponent } from './component/dskxcnk/dskxcnk.component';
import {NktpComponent} from "./component/pnktp/pnktp.component";
import { LenhNhanHangVeComponent } from './component/lenh-nhan-hang-ve/lenh-nhan-hang-ve.component';
import { LenhGhChoMuonTuComponent } from './component/lenh-gh-cho-muon-tu/lenh-gh-cho-muon-tu.component';
import { LenhGhXuatDoiBhComponent } from './component/lenh-gh-xuat-doi-bh/lenh-gh-xuat-doi-bh.component';

@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        Select2Module,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        SharedModule,
        SelectModule,
    ],
    declarations: [
        DashboardComponent,
        HeaderComponent,
        CompanyComponent,
        CategoryComponent,
        ProductComponent,
        ModelComponent,
        SerialComponent,
        AccessoriesComponent,
        AccountantComponent,
        DocumentComponent,
        DocumentsComponent,
        RoleComponent,
        ReceiptComponent,
        IssueComponent,
        RemovalComponent,
        UserComponent,
        CustomerComponent,
        IssuesComponent,
        ReceiptsComponent,
        RemovalsComponent,
        HpcallComponent,
        InventoryComponent,
        CenterComponent,
        StationComponent,
        LegalComponent,
        CpdlComponent,
        SurmountComponent,
        CauseComponent,
        TthtComponent,
        BtcscComponent,
        HpcallsyComponent,
        HpcallsnComponent,
        CreateOrderComponent,
        DncvtComponent,
        DsphieudnvtComponent,
        OrdersComponent,
        AccountComponent,
        LegalCreateComponent,
        PhieuscComponent,
        AddCustomerComponent,
        TthtCreateComponent,
        CauseCreateComponent,
        SurmountCreateComponent,
        CustomerEditComponent,
        SerialEditComponent,
        SerialCreateComponent,
        PbhdscComponent,
        PbhhtComponent,

        DspscComponent,
        HpcallActionComponent,
        InventoryoldComponent,
        LinhkienxacComponent,
        DsPhieuNhapKhoXacComponent,
        DsPhieuXuatKhoXacComponent,
        DsPhieuChuyenKhoXacComponent,
        DsPhieuChuyenKhoThanhPhamComponent,
        DsPhieuXuatKhoThanhPhamComponent,
        DsPhieuNhapKhoThanhPhamComponent,
        PnkscComponent,
        AccountantCreateComponent,
        CustomerCreateComponent,
        DscvctComponent,
        TdnlkComponent,
        DskxcnkComponent,
        NktpComponent,
        LenhNhanHangVeComponent,
        LenhGhChoMuonTuComponent,
        LenhGhXuatDoiBhComponent
        ]
})
export class DashboardModule {
}
