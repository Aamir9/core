import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Screen } from "@shared/AppConsts";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/app-component-base";
import { Base64Image } from "@shared/modals/base64image";
import {
  BrandServiceProxy,
  CatogoryServiceProxy,
  CustomFieldServiceProxy,
  GroupDto,
  GroupServiceProxy,
  Int32LookUpDto,
  ProductDto,
  ProductGroupServiceProxy,
  ProductServiceProxy,
  SupplierListDto,
  SupplierServiceProxy,
  UserDto,
  UserServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: "app-create-product",
  templateUrl: "./create-product.component.html",
  styleUrls: ["./create-product.component.css"],
  animations: [appModuleAnimation()],
})
export class CreateProductComponent extends AppComponentBase implements OnInit {
  productGroups: Int32LookUpDto[] = [];
  categories: Int32LookUpDto[] = [];
  brands: Int32LookUpDto[] = [];
  employees: UserDto[] = [];
  suppliers: SupplierListDto[] = [];
  @Output() onSave = new EventEmitter<any>();
  saving = false;
  id: number;
  isCustomFieldsAvailable = false;
  model: ProductDto = new ProductDto();
  title: string = "Create Product";
  isPhotoUploaded = true;
  groups: GroupDto[];

  constructor(
    private _productGroupService: ProductGroupServiceProxy,
    public injector: Injector,
    public bsModalRef: BsModalRef,
    private _productService: ProductServiceProxy,
    private _supplierService: SupplierServiceProxy,
    private _customFieldService: CustomFieldServiceProxy,
    private _brandService: BrandServiceProxy,
    private _categoryService: CatogoryServiceProxy,
    private _router: Router,
    private _userService: UserServiceProxy,
    private _groupService: GroupServiceProxy,
    private _modalService: BsModalService,
    private _route: ActivatedRoute
  ) {
    super(injector);
    let idString = this._route.snapshot.paramMap.get("id");
    if (idString) {
      this.id = Number.parseInt(idString);
      this.title = "Update Product";
    }
  }
  async ngOnInit(): Promise<void> {
    await this.loadProdutGroup();
    await this.loadBrands();
    await this.loadCategories();
    await this.loadGroups();
    await this.loadSuppliers();
    if (this.id > 0) {
      await this.getProduct(this.id);
      this.title = "EditProduct";
    } else {
      this.title = "CreateProduct";
      this.loadCustomFields();
    }
  }

  onFileUploadHandler(image: Base64Image) {
    this.model.base64Picture = image.ImageBase64String;
  }

  private async loadGroups() {
    this.groups = (await this._groupService.getAll().toPromise()).items;
    console.log(this.groups);
  }

  private async loadSuppliers() {
    this.suppliers = (await this._supplierService.getAll().toPromise()).items;
  }

  private async loadProdutGroup() {
    this.productGroups = (
      await this._productGroupService.getAll().toPromise()
    ).items;
  }

  private async loadBrands() {
    this.brands = (await this._brandService.getAll().toPromise()).items;
  }

  private async loadCategories() {
    this.categories = (await this._categoryService.getAll().toPromise()).items;
  }

  save(): void {
    this.saving = true;
    if (this.id > 0) {
      this._productService.update(this.model).subscribe(
        () => {
          this.notify.info(this.l("SavedSuccessfully"));
          this._router.navigate(["app/products"]);
          this.onSave.emit();
        },
        () => {
          this.saving = false;
        }
      );
    } else {
      this.model.responsibleGroups = null;
      this._productService.create(this.model).subscribe(
        () => {
          this.notify.info(this.l("SavedSuccessfully"));
          this._router.navigate(["app/products"]);
          this.onSave.emit();
        },
        () => {
          this.saving = false;
        }
      );
    }
  }

  async getProduct(id: number) {
    this._productService.getById(id).subscribe((result) => {
      this.model = result;
      this.isCustomFieldsAvailable = this.model.customFields.length > 0;
    });
  }

  loadCustomFields() {
    this._customFieldService
      .getScreenCustomFields(Screen.Product)
      .subscribe((result) => {
        this.model.customFields = result.items;
        this.isCustomFieldsAvailable = true;
      });
  }

  onCancelClick() {
    this._router.navigate(["app/products"]);
  }
}
