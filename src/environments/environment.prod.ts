export const environment = {
  production: true,
//   server_url: 'http://52.14.81.56:8080',
    server_url: 'http://192.168.1.3:8080',
    user: {
        email: 'ngocvietlala@gmail.com',
        ten: 'Victor Ngo',
        dien_thoai: '123123123',
        to_chuc_id: 1,
        trung_tam_bao_hanh_id: 1
    },
    trang_thai_phieu_dncvt: {
        de_nghi : 1,
        da_cap_phat: 2,
        tu_choi: 3,
        dong_y: 4,
        gui_trung_tam: 5,
        trung_tam_chuyen_kho: 6,
        linh_kien_ve_tram: 7
    },
    toChuc: {
        ten: 'To Chuc 1',
        id: 1
    },
    loai_chung_tu: {
        phieu_nhap_kho: 1,
        phieu_xuat_kho: 2,
        phieu_chuyen_kho: 3
    },
    loai_kho: {
        kho_tot: 1,
        kho_xac: 2,
        kho_thanh_pham: 3
    },
    loai_giao_dich: {
        xuat: -1,
        nhap: 1
    },
    loai_ct: {
        xuat_kho: 1,
        nhap_kho: 2,
        chuyen_kho: 3
    },
    loai_doi_tuong_phap_nhan: {
        '1': 'Người dùng',
        '2': 'Trung tâm',
        '3': 'Trạm',
        '4': 'Khách hàng',
        '5': 'Nhà cung ứng',
        '6': 'Khác'
    },
    loai_tram: {
        '1': 'Tiêu chuẩn',
        '2': 'Rút gọn'
    },
    kenh_tiep_nhan: {
        1: 'Trực tiếp',
        2: 'Điện thoại',
        3: 'Tin nhắn',
        4: 'Email',
        5: 'Khác',
    },
    uu_tien: {
        1: 'Thấp',
        2: 'Cao',
        3: 'Bình thường',
    },
    loai_hinh_dv: {
        1: 'Bảo hành',
        2: 'Thu phí'
    },
    noi_thuc_hien: {
        1: 'Tại trạm',
        2: 'Tại nhà khách',
    },
    status_serial: {
        '1': 'Chưa kích hoạt bảo hành',
        '2': 'Còn bảo hành',
        '3': 'Đang bảo hành',
        '4': 'Hết bảo hành',
    },
    status_psc: {
        '0': 'Tiếp nhận',
        '1': 'Hoàn Thành',
        '2': 'Chẩn đoán',
        '3': 'Chờ linh kiện',
        '4': 'Đang sửa chữa',
        '5': 'Chờ trả',
        '6': 'Chờ Happy Call',
        '7': 'Hoàn thành Happy Call',


    },
    status_phieu_de_nghi_lk: {
        '1': 'Đề nghị',
        '2': 'Đã cấp phát',
        '3': 'Từ chối',
        '4': 'Đồng ý',
        '5': 'Gửi trung tâm',
        '6': 'Trung tâm chuyển kho',
        '7': 'Linh kiện về trạm',
    },
    loai_chung_tu_cv: {
        '1': 'Đề nghị cấp vật tư',
        '2': 'Phiếu bảo hành',
        '3': 'Phiếu chuyển kho',
    },
    trang_thai_cong_viec: {
        '0': 'Chưa thực hiện',
        '1': 'Hoàn thành',
    },
    loai_cong_viec: {
        '1': 'Phân công PBH',
        '2': 'Tiếp nhận PBH',
        '3': 'Gọi Happy Call',
        '4': 'Yêu cầu kế toán cấp linh kiện'

    }

};
