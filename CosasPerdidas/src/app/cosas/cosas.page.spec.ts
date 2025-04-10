import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CosasPage } from './cosas.page';

describe('CosasPage', () => {
  let component: CosasPage;
  let fixture: ComponentFixture<CosasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CosasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
