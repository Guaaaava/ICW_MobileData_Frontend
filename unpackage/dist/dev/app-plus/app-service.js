if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const ON_SHOW = "onShow";
  const ON_LOAD = "onLoad";
  const ON_UNLOAD = "onUnload";
  const ON_NAVIGATION_BAR_BUTTON_TAP = "onNavigationBarButtonTap";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom2) {
    return typeof component === "string" ? easycom2 : component;
  }
  const createHook = (lifecycle) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onShow = /* @__PURE__ */ createHook(ON_SHOW);
  const onLoad = /* @__PURE__ */ createHook(ON_LOAD);
  const onUnload = /* @__PURE__ */ createHook(ON_UNLOAD);
  const onNavigationBarButtonTap = /* @__PURE__ */ createHook(ON_NAVIGATION_BAR_BUTTON_TAP);
  const _imports_0 = "/static/background.png";
  const _imports_1 = "/static/logo.png";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const BASE_URL = "http://110.42.214.164:8008/account";
  const _sfc_main$v = {
    data() {
      return {
        username: "",
        password: "",
        loading: false
      };
    },
    methods: {
      async login() {
        if (!this.username || !this.password) {
          uni.showToast({
            title: "用户名或密码不能为空",
            icon: "none"
          });
          return;
        }
        this.loading = true;
        try {
          const response = await uni.request({
            url: `${BASE_URL}/login`,
            // 替换为实际的登录API地址
            method: "POST",
            data: {
              username: this.username,
              password: this.password
            }
          });
          if (response.data && response.data.authentication) {
            if (response.data.authentication === true) {
              uni.showToast({
                title: "登录成功",
                icon: "success"
              });
              setTimeout(() => {
                uni.navigateTo({
                  url: "/pages/index/Guide"
                });
              }, 1e3);
            } else {
              uni.showToast({
                title: response.data.message || "登录失败",
                icon: "none"
              });
            }
          } else {
            uni.showToast({
              title: "登录失败：账号或者密码错误",
              icon: "none"
            });
          }
        } catch (error2) {
          uni.showToast({
            title: "网络错误，请稍后再试",
            icon: "none"
          });
          formatAppLog("error", "at pages/index/Login.vue:86", "请求错误：", error2);
        } finally {
          this.loading = false;
        }
      }
    }
  };
  function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "login-container" }, [
      vue.createElementVNode("image", {
        src: _imports_0,
        class: "background-image"
      }),
      vue.createElementVNode("view", { class: "login-box" }, [
        vue.createElementVNode("image", {
          src: _imports_1,
          alt: "Logo",
          class: "logo"
        }),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            type: "text",
            placeholder: "用户名",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.username = $event),
            class: "input-field"
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $data.username]
        ]),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            type: "password",
            placeholder: "密码",
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.password = $event),
            class: "input-field"
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $data.password]
        ]),
        vue.createElementVNode("view", { class: "button-group" }, [
          vue.createElementVNode("button", {
            onClick: _cache[2] || (_cache[2] = (...args) => $options.login && $options.login(...args)),
            class: "device-button"
          }, "登录"),
          vue.createCommentVNode(' <button @click="register" class="device-button">注册</button> ')
        ])
      ])
    ]);
  }
  const PagesIndexLogin = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$u], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/pages/index/Login.vue"]]);
  const _sfc_main$u = {
    data() {
      return {
        buildings: []
        // 用于存储从API获取的建筑数据
      };
    },
    methods: {
      async fetchBuildings() {
        const url2 = "http://110.42.214.164:8003/building";
        try {
          const response = await uni.request({
            url: url2,
            method: "GET",
            data: {}
          });
          if (response.data.code === 200 && response.data.data) {
            this.buildings = response.data.data;
          } else {
            uni.showToast({
              title: "网络错误，请稍后再试",
              icon: "none",
              duration: 2e3
            });
            formatAppLog("error", "at pages/index/SelectBuilding.vue:40", "网络错误：", error);
          }
        } catch (error2) {
          uni.showToast({
            title: "网络错误，请稍后再试",
            icon: "none",
            duration: 2e3
          });
          formatAppLog("error", "at pages/index/SelectBuilding.vue:49", "请求错误：", error2);
        }
      },
      goToBuilding(buildingId) {
        const url2 = `/pages/index/Building${buildingId}`;
        uni.navigateTo({
          url: url2
        });
      }
    },
    mounted() {
      this.fetchBuildings();
    }
  };
  function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "building-container" }, [
      vue.createElementVNode("view", { class: "prompt" }, "请选择检测设备所在的建筑"),
      vue.createElementVNode("view", { class: "building-box" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.buildings, (building) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: building.buildingId,
              class: "building-item",
              onClick: ($event) => $options.goToBuilding(building.buildingId)
            }, [
              vue.createElementVNode("image", {
                src: building.imageUrl,
                mode: "aspectFill",
                class: "building-image"
              }, null, 8, ["src"]),
              vue.createElementVNode(
                "view",
                { class: "building-name" },
                "同济大学 " + vue.toDisplayString(building.name),
                1
                /* TEXT */
              )
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ]);
  }
  const PagesIndexSelectBuilding = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$t], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/pages/index/SelectBuilding.vue"]]);
  const _sfc_main$t = {
    data() {
      return {
        sensors: [],
        selectedSensorId: null
      };
    },
    methods: {
      async fetchSensors() {
        const building = "综合楼";
        const encodedBuilding = encodeURIComponent(building);
        const url2 = `http://110.42.214.164:8003/sensor/${encodedBuilding}`;
        try {
          const response = await uni.request({
            url: url2,
            method: "GET",
            data: {}
          });
          if (response.data.code === 200 && response.data.data) {
            this.sensors = response.data.data;
          } else {
            formatAppLog("error", "at pages/index/Building1.vue:54", "Error fetching sensors:", error);
          }
        } catch (error2) {
          formatAppLog("error", "at pages/index/Building1.vue:57", "Error fetching sensors:", error2);
        }
      },
      handleSensorClick(sensor) {
        if (sensor.status === "0") {
          uni.showToast({
            title: "该设备暂时不可用",
            icon: "none"
          });
        } else {
          this.selectedSensorId = sensor.sensorId;
          uni.navigateTo({
            url: `/pages/index/SensorDetail${this.selectedSensorId}?device=${sensor.device}`
          });
        }
      }
    },
    mounted() {
      this.fetchSensors();
    }
  };
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", { class: "device-list" }, [
      vue.createCommentVNode(" 提示语 "),
      vue.createElementVNode("div", { class: "prompt-message" }, [
        vue.createTextVNode(" 请您选择"),
        vue.createElementVNode("span", { class: "highlight" }, "同济大学 综合楼"),
        vue.createTextVNode("的设备: ")
      ]),
      vue.createCommentVNode(" 设备按钮 "),
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($data.sensors, (sensor) => {
          return vue.openBlock(), vue.createElementBlock("button", {
            key: sensor.sensorId,
            class: vue.normalizeClass(["device-button", {
              "available": sensor.status === "1",
              "unavailable": sensor.status === "0",
              "scale-110": sensor.sensorId === $data.selectedSensorId
            }]),
            onClick: ($event) => $options.handleSensorClick(sensor)
          }, [
            vue.createTextVNode(
              vue.toDisplayString(sensor.building) + " - " + vue.toDisplayString(sensor.number) + " ",
              1
              /* TEXT */
            ),
            vue.createCommentVNode(" 在不可用的按钮上添加覆盖整个按钮的× "),
            sensor.status === "0" ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 0,
              class: "unavailable-indicator"
            }, "X")) : vue.createCommentVNode("v-if", true)
          ], 10, ["onClick"]);
        }),
        128
        /* KEYED_FRAGMENT */
      )),
      vue.createCommentVNode(" 提示框 "),
      vue.createElementVNode("div", { class: "unavailable-message" }, " 标红设备暂时不可用 ")
    ]);
  }
  const PagesIndexBuilding1 = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$s], ["__scopeId", "data-v-a01ee990"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/pages/index/Building1.vue"]]);
  const _sfc_main$s = {
    data() {
      return {
        sensors: [],
        selectedSensorId: null
      };
    },
    methods: {
      async fetchSensors() {
        const building = "A楼";
        const encodedBuilding = encodeURIComponent(building);
        const url2 = `http://110.42.214.164:8003/sensor/${encodedBuilding}`;
        try {
          const response = await uni.request({
            url: url2,
            method: "GET",
            data: {}
          });
          if (response.data.code === 200 && response.data.data) {
            this.sensors = response.data.data;
          } else {
            formatAppLog("error", "at pages/index/Building2.vue:53", "Error fetching sensors:", error);
          }
        } catch (error2) {
          formatAppLog("error", "at pages/index/Building2.vue:56", "Error fetching sensors:", error2);
        }
      },
      handleSensorClick(sensor) {
        if (sensor.status === "0") {
          uni.showToast({
            title: "该设备暂时不可用",
            icon: "none"
          });
        } else {
          this.selectedSensorId = sensor.sensorId;
          uni.navigateTo({
            url: `/pages/index/SensorDetail${this.selectedSensorId}?device=${sensor.device}`
          });
        }
      }
    },
    mounted() {
      this.fetchSensors();
    }
  };
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", { class: "device-list" }, [
      vue.createCommentVNode(" 提示语 "),
      vue.createElementVNode("div", { class: "prompt-message" }, [
        vue.createTextVNode(" 请您选择"),
        vue.createElementVNode("span", { class: "highlight" }, "A楼"),
        vue.createTextVNode("的设备: ")
      ]),
      vue.createCommentVNode(" 设备按钮 "),
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($data.sensors, (sensor) => {
          return vue.openBlock(), vue.createElementBlock("button", {
            key: sensor.sensorId,
            class: vue.normalizeClass(["device-button", {
              "available": sensor.status === "1",
              "unavailable": sensor.status === "0",
              "scale-110": sensor.sensorId === $data.selectedSensorId
            }]),
            onClick: ($event) => $options.handleSensorClick(sensor)
          }, [
            vue.createTextVNode(
              vue.toDisplayString(sensor.building) + " - " + vue.toDisplayString(sensor.number) + " ",
              1
              /* TEXT */
            ),
            vue.createCommentVNode(" 在不可用的按钮上添加覆盖整个按钮的× "),
            sensor.status === "0" ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 0,
              class: "unavailable-indicator"
            }, "X")) : vue.createCommentVNode("v-if", true)
          ], 10, ["onClick"]);
        }),
        128
        /* KEYED_FRAGMENT */
      )),
      vue.createElementVNode("div", { class: "unavailable-message" }, " 标红设备暂时不可用 ")
    ]);
  }
  const PagesIndexBuilding2 = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$r], ["__scopeId", "data-v-0f660c23"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/pages/index/Building2.vue"]]);
  const _sfc_main$r = {
    name: "u-icon",
    emits: ["click", "touchstart"],
    props: {
      // 图标类名
      name: {
        type: String,
        default: ""
      },
      // 图标颜色，可接受主题色
      color: {
        type: [String, null],
        default: ""
      },
      // 字体大小，单位rpx
      size: {
        type: [Number, String],
        default: "inherit"
      },
      // 是否显示粗体
      bold: {
        type: Boolean,
        default: false
      },
      // 点击图标的时候传递事件出去的index（用于区分点击了哪一个）
      index: {
        type: [Number, String],
        default: ""
      },
      // 触摸图标时的类名
      hoverClass: {
        type: String,
        default: ""
      },
      // 自定义扩展前缀，方便用户扩展自己的图标库
      customPrefix: {
        type: String,
        default: "uicon"
      },
      // 图标右边或者下面的文字
      label: {
        type: [String, Number],
        default: ""
      },
      // label的位置，只能右边或者下边
      labelPos: {
        type: String,
        default: "right"
      },
      // label的大小
      labelSize: {
        type: [String, Number],
        default: "28"
      },
      // label的颜色
      labelColor: {
        type: String,
        default: "#606266"
      },
      // label与图标的距离(横向排列)
      marginLeft: {
        type: [String, Number],
        default: "6"
      },
      // label与图标的距离(竖向排列)
      marginTop: {
        type: [String, Number],
        default: "6"
      },
      // label与图标的距离(竖向排列)
      marginRight: {
        type: [String, Number],
        default: "6"
      },
      // label与图标的距离(竖向排列)
      marginBottom: {
        type: [String, Number],
        default: "6"
      },
      // 图片的mode
      imgMode: {
        type: String,
        default: "widthFix"
      },
      // 自定义样式
      customStyle: {
        type: Object,
        default() {
          return {};
        }
      },
      // 用于显示图片小图标时，图片的宽度
      width: {
        type: [String, Number],
        default: ""
      },
      // 用于显示图片小图标时，图片的高度
      height: {
        type: [String, Number],
        default: ""
      },
      // 用于解决某些情况下，让图标垂直居中的用途
      top: {
        type: [String, Number],
        default: 0
      },
      // 是否为DecimalIcon
      showDecimalIcon: {
        type: Boolean,
        default: false
      },
      // 背景颜色，可接受主题色，仅Decimal时有效
      inactiveColor: {
        type: String,
        default: "#ececec"
      },
      // 显示的百分比，仅Decimal时有效
      percent: {
        type: [Number, String],
        default: "50"
      }
    },
    computed: {
      customClass() {
        let classes = [];
        let { customPrefix, name } = this;
        let index = name.indexOf("-icon-");
        if (index > -1) {
          customPrefix = name.substring(0, index + 5);
          classes.push(name);
        } else {
          classes.push(`${customPrefix}-${name}`);
        }
        if (customPrefix === "uicon") {
          classes.push("u-iconfont");
        } else {
          classes.push(customPrefix);
        }
        if (this.showDecimalIcon && this.inactiveColor && this.$u.config.type.includes(this.inactiveColor)) {
          classes.push("u-icon__icon--" + this.inactiveColor);
        } else if (this.color && this.$u.config.type.includes(this.color))
          classes.push("u-icon__icon--" + this.color);
        return classes;
      },
      iconStyle() {
        let style = {};
        style = {
          fontSize: this.size == "inherit" ? "inherit" : this.$u.addUnit(this.size),
          fontWeight: this.bold ? "bold" : "normal",
          // 某些特殊情况需要设置一个到顶部的距离，才能更好的垂直居中
          top: this.$u.addUnit(this.top)
        };
        if (this.showDecimalIcon && this.inactiveColor && !this.$u.config.type.includes(this.inactiveColor)) {
          style.color = this.inactiveColor;
        } else if (this.color && !this.$u.config.type.includes(this.color))
          style.color = this.color;
        return style;
      },
      // 判断传入的name属性，是否图片路径，只要带有"/"均认为是图片形式
      isImg() {
        return this.name.indexOf("/") !== -1;
      },
      imgStyle() {
        let style = {};
        style.width = this.width ? this.$u.addUnit(this.width) : this.$u.addUnit(this.size);
        style.height = this.height ? this.$u.addUnit(this.height) : this.$u.addUnit(this.size);
        return style;
      },
      decimalIconStyle() {
        let style = {};
        style = {
          fontSize: this.size == "inherit" ? "inherit" : this.$u.addUnit(this.size),
          fontWeight: this.bold ? "bold" : "normal",
          // 某些特殊情况需要设置一个到顶部的距离，才能更好的垂直居中
          top: this.$u.addUnit(this.top),
          width: this.percent + "%"
        };
        if (this.color && !this.$u.config.type.includes(this.color))
          style.color = this.color;
        return style;
      },
      decimalIconClass() {
        let classes = [];
        classes.push(this.customPrefix + "-" + this.name);
        if (this.customPrefix == "uicon") {
          classes.push("u-iconfont");
        } else {
          classes.push(this.customPrefix);
        }
        if (this.color && this.$u.config.type.includes(this.color))
          classes.push("u-icon__icon--" + this.color);
        else
          classes.push("u-icon__icon--primary");
        return classes;
      }
    },
    methods: {
      click() {
        this.$emit("click", this.index);
      },
      touchstart() {
        this.$emit("touchstart", this.index);
      }
    }
  };
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        style: vue.normalizeStyle([$props.customStyle]),
        class: vue.normalizeClass(["u-icon", ["u-icon--" + $props.labelPos]]),
        onClick: _cache[1] || (_cache[1] = (...args) => $options.click && $options.click(...args))
      },
      [
        $options.isImg ? (vue.openBlock(), vue.createElementBlock("image", {
          key: 0,
          class: "u-icon__img",
          src: $props.name,
          mode: $props.imgMode,
          style: vue.normalizeStyle([$options.imgStyle])
        }, null, 12, ["src", "mode"])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: vue.normalizeClass(["u-icon__icon", $options.customClass]),
          style: vue.normalizeStyle([$options.iconStyle]),
          "hover-class": $props.hoverClass,
          onTouchstart: _cache[0] || (_cache[0] = (...args) => $options.touchstart && $options.touchstart(...args))
        }, [
          $props.showDecimalIcon ? (vue.openBlock(), vue.createElementBlock("text", {
            key: 0,
            style: vue.normalizeStyle([$options.decimalIconStyle]),
            class: vue.normalizeClass([$options.decimalIconClass, "u-icon__decimal"]),
            "hover-class": $props.hoverClass
          }, null, 14, ["hover-class"])) : vue.createCommentVNode("v-if", true)
        ], 46, ["hover-class"])),
        vue.createCommentVNode(' 这里进行空字符串判断，如果仅仅是v-if="label"，可能会出现传递0的时候，结果也无法显示，微信小程序不传值默认为null，故需要增加null的判断 '),
        $props.label !== "" && $props.label !== null ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 2,
            class: "u-icon__label",
            style: vue.normalizeStyle({
              color: $props.labelColor,
              fontSize: _ctx.$u.addUnit($props.labelSize),
              marginLeft: $props.labelPos == "right" ? _ctx.$u.addUnit($props.marginLeft) : 0,
              marginTop: $props.labelPos == "bottom" ? _ctx.$u.addUnit($props.marginTop) : 0,
              marginRight: $props.labelPos == "left" ? _ctx.$u.addUnit($props.marginRight) : 0,
              marginBottom: $props.labelPos == "top" ? _ctx.$u.addUnit($props.marginBottom) : 0
            })
          },
          vue.toDisplayString($props.label),
          5
          /* TEXT, STYLE */
        )) : vue.createCommentVNode("v-if", true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0$6 = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$q], ["__scopeId", "data-v-5de67484"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/uni_modules/vk-uview-ui/components/u-icon/u-icon.vue"]]);
  const _sfc_main$q = {
    name: "u-toast",
    props: {
      // z-index值
      zIndex: {
        type: [Number, String],
        default: ""
      }
    },
    data() {
      return {
        isShow: false,
        timer: null,
        // 定时器
        config: {
          params: {},
          // URL跳转的参数，对象
          title: "",
          // 显示文本
          type: "",
          // 主题类型，primary，success，error，warning，black
          duration: 2e3,
          // 显示的时间，毫秒
          isTab: false,
          // 是否跳转tab页面
          url: "",
          // toast消失后是否跳转页面，有则跳转，优先级高于back参数
          icon: true,
          // 显示的图标
          position: "center",
          // toast出现的位置
          callback: null,
          // 执行完后的回调函数
          back: false
          // 结束toast是否自动返回上一页
        },
        tmpConfig: {}
        // 将用户配置和内置配置合并后的临时配置变量
      };
    },
    computed: {
      iconName() {
        if (["error", "warning", "success", "info"].indexOf(this.tmpConfig.type) >= 0 && this.tmpConfig.icon) {
          let icon = this.$u.type2icon(this.tmpConfig.type);
          return icon;
        }
      },
      uZIndex() {
        return this.isShow ? this.zIndex ? this.zIndex : this.$u.zIndex.toast : "999999";
      }
    },
    methods: {
      // 显示toast组件，由父组件通过this.$refs.xxx.show(options)形式调用
      show(options) {
        this.tmpConfig = this.$u.deepMerge(this.config, options);
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.isShow = true;
        this.timer = setTimeout(() => {
          this.isShow = false;
          clearTimeout(this.timer);
          this.timer = null;
          typeof this.tmpConfig.callback === "function" && this.tmpConfig.callback();
          this.timeEnd();
        }, this.tmpConfig.duration);
      },
      // 隐藏toast组件，由父组件通过this.$refs.xxx.hide()形式调用
      hide() {
        this.isShow = false;
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
      },
      // 倒计时结束之后，进行的一些操作
      timeEnd() {
        if (this.tmpConfig.url) {
          if (this.tmpConfig.url[0] != "/")
            this.tmpConfig.url = "/" + this.tmpConfig.url;
          if (Object.keys(this.tmpConfig.params).length) {
            let query = "";
            if (/.*\/.*\?.*=.*/.test(this.tmpConfig.url)) {
              query = this.$u.queryParams(this.tmpConfig.params, false);
              this.tmpConfig.url = this.tmpConfig.url + "&" + query;
            } else {
              query = this.$u.queryParams(this.tmpConfig.params);
              this.tmpConfig.url += query;
            }
          }
          if (this.tmpConfig.isTab) {
            uni.switchTab({
              url: this.tmpConfig.url
            });
          } else {
            uni.navigateTo({
              url: this.tmpConfig.url
            });
          }
        } else if (this.tmpConfig.back) {
          this.$u.route({
            type: "back"
          });
        }
      }
    }
  };
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_icon = resolveEasycom(vue.resolveDynamicComponent("u-icon"), __easycom_0$6);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["u-toast", [$data.isShow ? "u-show" : "", "u-type-" + $data.tmpConfig.type, "u-position-" + $data.tmpConfig.position]]),
        style: vue.normalizeStyle({
          zIndex: $options.uZIndex
        })
      },
      [
        vue.createElementVNode("view", { class: "u-icon-wrap" }, [
          $data.tmpConfig.icon ? (vue.openBlock(), vue.createBlock(_component_u_icon, {
            key: 0,
            class: "u-icon",
            name: $options.iconName,
            size: 30,
            color: $data.tmpConfig.type
          }, null, 8, ["name", "color"])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode(
          "text",
          { class: "u-text" },
          vue.toDisplayString($data.tmpConfig.title),
          1
          /* TEXT */
        )
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0$5 = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$p], ["__scopeId", "data-v-dcb3ce67"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/uni_modules/vk-uview-ui/components/u-toast/u-toast.vue"]]);
  const _sfc_main$p = {
    name: "u-loading",
    props: {
      // 动画的类型
      mode: {
        type: String,
        default: "circle"
      },
      // 动画的颜色
      color: {
        type: String,
        default: "#c7c7c7"
      },
      // 加载图标的大小，单位rpx
      size: {
        type: [String, Number],
        default: "34"
      },
      // 是否显示动画
      show: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      // 加载中圆圈动画的样式
      cricleStyle() {
        let style = {};
        style.width = this.size + "rpx";
        style.height = this.size + "rpx";
        if (this.mode == "circle")
          style.borderColor = `#e4e4e4 #e4e4e4 #e4e4e4 ${this.color ? this.color : "#c7c7c7"}`;
        return style;
      }
    }
  };
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    return $props.show ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: vue.normalizeClass(["u-loading", $props.mode == "circle" ? "u-loading-circle" : "u-loading-flower"]),
        style: vue.normalizeStyle([$options.cricleStyle])
      },
      null,
      6
      /* CLASS, STYLE */
    )) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_0$4 = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o], ["__scopeId", "data-v-32db0ed8"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/uni_modules/vk-uview-ui/components/u-loading/u-loading.vue"]]);
  const _sfc_main$o = {
    name: "u-mask",
    emits: ["click"],
    props: {
      // 是否显示遮罩
      show: {
        type: Boolean,
        default: false
      },
      // 层级z-index
      zIndex: {
        type: [Number, String],
        default: ""
      },
      // 用户自定义样式
      customStyle: {
        type: Object,
        default() {
          return {};
        }
      },
      // 遮罩的动画样式， 是否使用使用zoom进行scale进行缩放
      zoom: {
        type: Boolean,
        default: true
      },
      // 遮罩的过渡时间，单位为ms
      duration: {
        type: [Number, String],
        default: 300
      },
      // 是否可以通过点击遮罩进行关闭
      maskClickAble: {
        type: Boolean,
        default: true
      },
      // 遮罩的模糊度
      blur: {
        type: [Number, String],
        default: 0
      }
    },
    data() {
      return {
        zoomStyle: {
          transform: ""
        },
        scale: "scale(1.2, 1.2)"
      };
    },
    watch: {
      show(n2) {
        if (n2 && this.zoom) {
          this.zoomStyle.transform = "scale(1, 1)";
        } else if (!n2 && this.zoom) {
          this.zoomStyle.transform = this.scale;
        }
      }
    },
    computed: {
      maskStyle() {
        let style = {};
        style.backgroundColor = "rgba(0, 0, 0, 0.6)";
        if (this.show)
          style.zIndex = this.zIndex ? this.zIndex : this.$u.zIndex.mask;
        else
          style.zIndex = -1;
        style.transition = `all ${this.duration / 1e3}s ease-in-out`;
        if (Object.keys(this.customStyle).length)
          style = {
            ...style,
            ...this.customStyle
          };
        return style;
      },
      filterStyle() {
        let { blur } = this;
        let style = {};
        if (blur) {
          style.backdropFilter = `blur(${blur}rpx)`;
        }
        return style;
      }
    },
    methods: {
      click() {
        if (!this.maskClickAble)
          return;
        this.$emit("click");
      }
    }
  };
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["u-mask", {
          "u-mask-zoom": $props.zoom,
          "u-mask-show": $props.show
        }]),
        "hover-stop-propagation": "",
        style: vue.normalizeStyle([$options.maskStyle, $data.zoomStyle, $options.filterStyle]),
        onClick: _cache[0] || (_cache[0] = (...args) => $options.click && $options.click(...args)),
        onTouchmove: vue.withModifiers(() => {
        }, ["stop", "prevent"])
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      38
      /* CLASS, STYLE, NEED_HYDRATION */
    );
  }
  const __easycom_0$3 = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["__scopeId", "data-v-b3b508a8"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/uni_modules/vk-uview-ui/components/u-mask/u-mask.vue"]]);
  const _sfc_main$n = {
    name: "u-popup",
    emits: ["update:modelValue", "input", "open", "close"],
    props: {
      value: {
        type: Boolean,
        default: false
      },
      modelValue: {
        type: Boolean,
        default: false
      },
      /**
       * 显示状态
       */
      show: {
        type: Boolean,
        default: false
      },
      /**
       * 弹出方向，left|right|top|bottom|center
       */
      mode: {
        type: String,
        default: "left"
      },
      /**
       * 是否显示遮罩
       */
      mask: {
        type: Boolean,
        default: true
      },
      // 抽屉的宽度(mode=left|right)，或者高度(mode=top|bottom)，单位rpx，或者"auto"
      // 或者百分比"50%"，表示由内容撑开高度或者宽度
      length: {
        type: [Number, String],
        default: "auto"
      },
      // 是否开启缩放动画，只在mode=center时有效
      zoom: {
        type: Boolean,
        default: true
      },
      // 是否开启底部安全区适配，开启的话，会在iPhoneX机型底部添加一定的内边距
      safeAreaInsetBottom: {
        type: Boolean,
        default: false
      },
      // 是否可以通过点击遮罩进行关闭
      maskCloseAble: {
        type: Boolean,
        default: true
      },
      // 用户自定义样式
      customStyle: {
        type: Object,
        default() {
          return {};
        }
      },
      // 此为内部参数，不在文档对外使用，为了解决Picker和keyboard等融合了弹窗的组件
      // 对v-model双向绑定多层调用造成报错不能修改props值的问题
      popup: {
        type: Boolean,
        default: true
      },
      // 显示显示弹窗的圆角，单位rpx
      borderRadius: {
        type: [Number, String],
        default: 0
      },
      zIndex: {
        type: [Number, String],
        default: ""
      },
      // 是否显示关闭图标
      closeable: {
        type: Boolean,
        default: false
      },
      // 关闭图标的名称，只能uView的内置图标
      closeIcon: {
        type: String,
        default: "close"
      },
      // 自定义关闭图标位置，top-left为左上角，top-right为右上角，bottom-left为左下角，bottom-right为右下角
      closeIconPos: {
        type: String,
        default: "top-right"
      },
      // 关闭图标的颜色
      closeIconColor: {
        type: String,
        default: "#909399"
      },
      // 关闭图标的大小，单位rpx
      closeIconSize: {
        type: [String, Number],
        default: "30"
      },
      // 宽度，只对左，右，中部弹出时起作用，单位rpx，或者"auto"
      // 或者百分比"50%"，表示由内容撑开高度或者宽度，优先级高于length参数
      width: {
        type: String,
        default: ""
      },
      // 高度，只对上，下，中部弹出时起作用，单位rpx，或者"auto"
      // 或者百分比"50%"，表示由内容撑开高度或者宽度，优先级高于length参数
      height: {
        type: String,
        default: ""
      },
      // 给一个负的margin-top，往上偏移，避免和键盘重合的情况，仅在mode=center时有效
      negativeTop: {
        type: [String, Number],
        default: 0
      },
      // 遮罩的样式，一般用于修改遮罩的透明度
      maskCustomStyle: {
        type: Object,
        default() {
          return {};
        }
      },
      // 遮罩打开或收起的动画过渡时间，单位ms
      duration: {
        type: [String, Number],
        default: 250
      },
      // 遮罩的模糊度
      blur: {
        type: [String, Number],
        default: 0
      }
    },
    data() {
      return {
        visibleSync: false,
        showDrawer: false,
        timer: null,
        closeFromInner: false
        // value的值改变，是发生在内部还是外部
      };
    },
    computed: {
      valueCom() {
        return this.modelValue;
      },
      // 根据mode的位置，设定其弹窗的宽度(mode = left|right)，或者高度(mode = top|bottom)
      style() {
        let style = {};
        if (this.mode == "left" || this.mode == "right") {
          style = {
            width: this.width ? this.getUnitValue(this.width) : this.getUnitValue(this.length),
            height: "100%",
            transform: `translate3D(${this.mode == "left" ? "-100%" : "100%"},0px,0px)`
          };
        } else if (this.mode == "top" || this.mode == "bottom") {
          style = {
            width: "100%",
            height: this.height ? this.getUnitValue(this.height) : this.getUnitValue(this.length),
            transform: `translate3D(0px,${this.mode == "top" ? "-100%" : "100%"},0px)`
          };
        }
        style.zIndex = this.uZindex;
        if (this.borderRadius) {
          switch (this.mode) {
            case "left":
              style.borderRadius = `0 ${this.borderRadius}rpx ${this.borderRadius}rpx 0`;
              break;
            case "top":
              style.borderRadius = `0 0 ${this.borderRadius}rpx ${this.borderRadius}rpx`;
              break;
            case "right":
              style.borderRadius = `${this.borderRadius}rpx 0 0 ${this.borderRadius}rpx`;
              break;
            case "bottom":
              style.borderRadius = `${this.borderRadius}rpx ${this.borderRadius}rpx 0 0`;
              break;
          }
          style.overflow = "hidden";
        }
        if (this.duration)
          style.transition = `all ${this.duration / 1e3}s linear`;
        return style;
      },
      // 中部弹窗的特有样式
      centerStyle() {
        let style = {};
        style.width = this.width ? this.getUnitValue(this.width) : this.getUnitValue(this.length);
        style.height = this.height ? this.getUnitValue(this.height) : "auto";
        style.zIndex = this.uZindex;
        style.marginTop = `-${this.$u.addUnit(this.negativeTop)}`;
        if (this.borderRadius) {
          style.borderRadius = `${this.borderRadius}rpx`;
          style.overflow = "hidden";
        }
        return style;
      },
      // 计算整理后的z-index值
      uZindex() {
        return this.zIndex ? this.zIndex : this.$u.zIndex.popup;
      }
    },
    watch: {
      valueCom: {
        handler(val) {
          if (val) {
            this.open();
          } else if (!this.closeFromInner) {
            this.close();
          }
          this.closeFromInner = false;
        }
      }
    },
    mounted() {
      if (this.valueCom) {
        this.open();
      }
    },
    methods: {
      // 判断传入的值，是否带有单位，如果没有，就默认用rpx单位
      getUnitValue(val) {
        if (/(%|px|rpx|auto)$/.test(val))
          return val;
        else
          return val + "rpx";
      },
      // 遮罩被点击
      maskClick() {
        this.close();
      },
      close() {
        this.closeFromInner = true;
        this.change("showDrawer", "visibleSync", false);
      },
      // 中部弹出时，需要.u-drawer-content将居中内容，此元素会铺满屏幕，点击需要关闭弹窗
      // 让其只在mode=center时起作用
      modeCenterClose(mode) {
        if (mode != "center" || !this.maskCloseAble)
          return;
        this.close();
      },
      open() {
        this.change("visibleSync", "showDrawer", true);
      },
      // 此处的原理是，关闭时先通过动画隐藏弹窗和遮罩，再移除整个组件
      // 打开时，先渲染组件，延时一定时间再让遮罩和弹窗的动画起作用
      change(param1, param2, status) {
        if (this.popup == true) {
          this.$emit("input", status);
          this.$emit("update:modelValue", status);
        }
        this[param1] = status;
        if (status) {
          this.$nextTick(() => {
            this[param2] = status;
            this.$emit(status ? "open" : "close");
          });
        } else {
          this.timer = setTimeout(() => {
            this[param2] = status;
            this.$emit(status ? "open" : "close");
          }, this.duration);
        }
      }
    }
  };
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_mask = resolveEasycom(vue.resolveDynamicComponent("u-mask"), __easycom_0$3);
    const _component_u_icon = resolveEasycom(vue.resolveDynamicComponent("u-icon"), __easycom_0$6);
    return $data.visibleSync ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        style: vue.normalizeStyle([$props.customStyle, {
          zIndex: $options.uZindex - 1
        }]),
        class: "u-drawer",
        "hover-stop-propagation": ""
      },
      [
        vue.createVNode(_component_u_mask, {
          blur: $props.blur,
          duration: $props.duration,
          "custom-style": $props.maskCustomStyle,
          maskClickAble: $props.maskCloseAble,
          "z-index": $options.uZindex - 2,
          show: $data.showDrawer && $props.mask,
          onClick: $options.maskClick
        }, null, 8, ["blur", "duration", "custom-style", "maskClickAble", "z-index", "show", "onClick"]),
        vue.createCommentVNode(" 移除	@tap.stop.prevent "),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["u-drawer-content", [
              $props.safeAreaInsetBottom ? "safe-area-inset-bottom" : "",
              "u-drawer-" + $props.mode,
              $data.showDrawer ? "u-drawer-content-visible" : "",
              $props.zoom && $props.mode == "center" ? "u-animation-zoom" : ""
            ]]),
            onClick: _cache[3] || (_cache[3] = ($event) => $options.modeCenterClose($props.mode)),
            onTouchmove: _cache[4] || (_cache[4] = vue.withModifiers(() => {
            }, ["stop", "prevent"])),
            style: vue.normalizeStyle([$options.style])
          },
          [
            $props.mode == "center" ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: "u-mode-center-box",
                onClick: _cache[0] || (_cache[0] = vue.withModifiers(() => {
                }, ["stop", "prevent"])),
                onTouchmove: _cache[1] || (_cache[1] = vue.withModifiers(() => {
                }, ["stop", "prevent"])),
                style: vue.normalizeStyle([$options.centerStyle])
              },
              [
                $props.closeable ? (vue.openBlock(), vue.createBlock(_component_u_icon, {
                  key: 0,
                  onClick: $options.close,
                  class: vue.normalizeClass(["u-close", ["u-close--" + $props.closeIconPos]]),
                  name: $props.closeIcon,
                  color: $props.closeIconColor,
                  size: $props.closeIconSize
                }, null, 8, ["onClick", "class", "name", "color", "size"])) : vue.createCommentVNode("v-if", true),
                vue.createElementVNode("scroll-view", {
                  class: "u-drawer__scroll-view",
                  "scroll-y": "true"
                }, [
                  vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
                ])
              ],
              36
              /* STYLE, NEED_HYDRATION */
            )) : (vue.openBlock(), vue.createElementBlock("scroll-view", {
              key: 1,
              class: "u-drawer__scroll-view",
              "scroll-y": "true"
            }, [
              vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
            ])),
            vue.createElementVNode(
              "view",
              {
                onClick: _cache[2] || (_cache[2] = (...args) => $options.close && $options.close(...args)),
                class: vue.normalizeClass(["u-close", ["u-close--" + $props.closeIconPos]])
              },
              [
                $props.mode != "center" && $props.closeable ? (vue.openBlock(), vue.createBlock(_component_u_icon, {
                  key: 0,
                  name: $props.closeIcon,
                  color: $props.closeIconColor,
                  size: $props.closeIconSize
                }, null, 8, ["name", "color", "size"])) : vue.createCommentVNode("v-if", true)
              ],
              2
              /* CLASS */
            )
          ],
          38
          /* CLASS, STYLE, NEED_HYDRATION */
        )
      ],
      4
      /* STYLE */
    )) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m], ["__scopeId", "data-v-c93a8fd2"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/uni_modules/vk-uview-ui/components/u-popup/u-popup.vue"]]);
  const _sfc_main$m = {
    name: "u-modal",
    emits: ["update:modelValue", "input", "confirm", "cancel"],
    props: {
      // 是否显示Modal
      value: {
        type: Boolean,
        default: false
      },
      modelValue: {
        type: Boolean,
        default: false
      },
      // 层级z-index
      zIndex: {
        type: [Number, String],
        default: ""
      },
      // 标题
      title: {
        type: [String],
        default: "提示"
      },
      // 弹窗宽度，可以是数值(rpx)，百分比，auto等
      width: {
        type: [Number, String],
        default: 600
      },
      // 弹窗内容
      content: {
        type: String,
        default: "内容"
      },
      // 是否显示标题
      showTitle: {
        type: Boolean,
        default: true
      },
      // 是否显示确认按钮
      showConfirmButton: {
        type: Boolean,
        default: true
      },
      // 是否显示取消按钮
      showCancelButton: {
        type: Boolean,
        default: false
      },
      // 确认文案
      confirmText: {
        type: String,
        default: "确认"
      },
      // 取消文案
      cancelText: {
        type: String,
        default: "取消"
      },
      // 确认按钮颜色
      confirmColor: {
        type: String,
        default: "#2979ff"
      },
      // 取消文字颜色
      cancelColor: {
        type: String,
        default: "#606266"
      },
      // 圆角值
      borderRadius: {
        type: [Number, String],
        default: 16
      },
      // 标题的样式
      titleStyle: {
        type: Object,
        default() {
          return {};
        }
      },
      // 内容的样式
      contentStyle: {
        type: Object,
        default() {
          return {};
        }
      },
      // 取消按钮的样式
      cancelStyle: {
        type: Object,
        default() {
          return {};
        }
      },
      // 确定按钮的样式
      confirmStyle: {
        type: Object,
        default() {
          return {};
        }
      },
      // 是否开启缩放效果
      zoom: {
        type: Boolean,
        default: true
      },
      // 是否异步关闭，只对确定按钮有效
      asyncClose: {
        type: Boolean,
        default: false
      },
      // 是否允许点击遮罩关闭modal
      maskCloseAble: {
        type: Boolean,
        default: false
      },
      // 给一个负的margin-top，往上偏移，避免和键盘重合的情况
      negativeTop: {
        type: [String, Number],
        default: 0
      },
      // 遮罩的模糊度
      blur: {
        type: [Number, String],
        default: 0
      }
    },
    data() {
      return {
        loading: false,
        // 确认按钮是否正在加载中
        popupValue: false
      };
    },
    computed: {
      valueCom() {
        return this.modelValue;
      },
      cancelBtnStyle() {
        return Object.assign(
          {
            color: this.cancelColor
          },
          this.cancelStyle
        );
      },
      confirmBtnStyle() {
        return Object.assign(
          {
            color: this.confirmColor
          },
          this.confirmStyle
        );
      },
      uZIndex() {
        return this.zIndex ? this.zIndex : this.$u.zIndex.popup;
      }
    },
    watch: {
      // 如果是异步关闭时，外部修改v-model的值为false时，重置内部的loading状态
      // 避免下次打开的时候，状态混乱
      valueCom: {
        immediate: true,
        handler(n2) {
          if (n2 === true)
            this.loading = false;
          this.popupValue = n2;
        }
      }
    },
    methods: {
      confirm() {
        if (this.asyncClose) {
          this.loading = true;
        } else {
          this.$emit("input", false);
          this.$emit("update:modelValue", false);
        }
        this.$emit("confirm");
      },
      cancel() {
        this.$emit("cancel");
        this.$emit("input", false);
        this.$emit("update:modelValue", false);
        setTimeout(() => {
          this.loading = false;
        }, 300);
      },
      // 点击遮罩关闭modal，设置v-model的值为false，否则无法第二次弹起modal
      popupClose() {
        this.$emit("input", false);
        this.$emit("update:modelValue", false);
      },
      // 清除加载中的状态
      clearLoading() {
        this.loading = false;
      }
    }
  };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_loading = resolveEasycom(vue.resolveDynamicComponent("u-loading"), __easycom_0$4);
    const _component_u_popup = resolveEasycom(vue.resolveDynamicComponent("u-popup"), __easycom_0$2);
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createVNode(_component_u_popup, {
        blur: $props.blur,
        zoom: $props.zoom,
        mode: "center",
        popup: false,
        "z-index": $options.uZIndex,
        modelValue: $data.popupValue,
        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.popupValue = $event),
        length: $props.width,
        "mask-close-able": $props.maskCloseAble,
        "border-radius": $props.borderRadius,
        onClose: $options.popupClose,
        "negative-top": $props.negativeTop
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "u-model" }, [
            $props.showTitle ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: "u-model__title u-line-1",
                style: vue.normalizeStyle([$props.titleStyle])
              },
              vue.toDisplayString($props.title),
              5
              /* TEXT, STYLE */
            )) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "u-model__content" }, [
              _ctx.$slots.default || _ctx.$slots.$default ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 0,
                  style: vue.normalizeStyle([$props.contentStyle])
                },
                [
                  vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
                ],
                4
                /* STYLE */
              )) : (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 1,
                  class: "u-model__content__message",
                  style: vue.normalizeStyle([$props.contentStyle])
                },
                vue.toDisplayString($props.content),
                5
                /* TEXT, STYLE */
              ))
            ]),
            $props.showCancelButton || $props.showConfirmButton ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "u-model__footer u-border-top"
            }, [
              $props.showCancelButton ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 0,
                  "hover-stay-time": 100,
                  "hover-class": "u-model__btn--hover",
                  class: "u-model__footer__button",
                  style: vue.normalizeStyle([$options.cancelBtnStyle]),
                  onClick: _cache[0] || (_cache[0] = (...args) => $options.cancel && $options.cancel(...args))
                },
                vue.toDisplayString($props.cancelText),
                5
                /* TEXT, STYLE */
              )) : vue.createCommentVNode("v-if", true),
              $props.showConfirmButton || _ctx.$slots["confirm-button"] ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                "hover-stay-time": 100,
                "hover-class": $props.asyncClose ? "none" : "u-model__btn--hover",
                class: "u-model__footer__button hairline-left",
                style: vue.normalizeStyle([$options.confirmBtnStyle]),
                onClick: _cache[1] || (_cache[1] = (...args) => $options.confirm && $options.confirm(...args))
              }, [
                _ctx.$slots["confirm-button"] ? vue.renderSlot(_ctx.$slots, "confirm-button", { key: 0 }, void 0, true) : (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  { key: 1 },
                  [
                    $data.loading ? (vue.openBlock(), vue.createBlock(_component_u_loading, {
                      key: 0,
                      mode: "circle",
                      color: $props.confirmColor
                    }, null, 8, ["color"])) : (vue.openBlock(), vue.createElementBlock(
                      vue.Fragment,
                      { key: 1 },
                      [
                        vue.createTextVNode(
                          vue.toDisplayString($props.confirmText),
                          1
                          /* TEXT */
                        )
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    ))
                  ],
                  64
                  /* STABLE_FRAGMENT */
                ))
              ], 12, ["hover-class"])) : vue.createCommentVNode("v-if", true)
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ]),
        _: 3
        /* FORWARDED */
      }, 8, ["blur", "zoom", "z-index", "modelValue", "length", "mask-close-able", "border-radius", "onClose", "negative-top"])
    ]);
  }
  const __easycom_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__scopeId", "data-v-5708b0b9"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/uni_modules/vk-uview-ui/components/u-modal/u-modal.vue"]]);
  const _sfc_main$l = {
    name: "u-switch",
    emits: ["update:modelValue", "input", "change"],
    props: {
      // 通过v-model双向绑定的值
      value: {
        type: Boolean,
        default: false
      },
      modelValue: {
        type: Boolean,
        default: false
      },
      // 是否为加载中状态
      loading: {
        type: Boolean,
        default: false
      },
      // 是否为禁用装填
      disabled: {
        type: Boolean,
        default: false
      },
      // 开关尺寸，单位rpx
      size: {
        type: [Number, String],
        default: 50
      },
      // 打开时的背景颜色
      activeColor: {
        type: String,
        default: "#2979ff"
      },
      // 关闭时的背景颜色
      inactiveColor: {
        type: String,
        default: "#ffffff"
      },
      // 是否使手机发生短促震动，目前只在iOS的微信小程序有效(2020-05-06)
      vibrateShort: {
        type: Boolean,
        default: false
      },
      // 打开选择器时的值
      activeValue: {
        type: [Number, String, Boolean],
        default: true
      },
      // 关闭选择器时的值
      inactiveValue: {
        type: [Number, String, Boolean],
        default: false
      }
    },
    data() {
      return {};
    },
    computed: {
      valueCom() {
        return this.modelValue;
      },
      switchStyle() {
        let style = {};
        style.fontSize = this.size + "rpx";
        style.backgroundColor = this.valueCom ? this.activeColor : this.inactiveColor;
        return style;
      },
      loadingColor() {
        return this.valueCom ? this.activeColor : null;
      }
    },
    methods: {
      onClick() {
        if (!this.disabled && !this.loading) {
          if (this.vibrateShort)
            uni.vibrateShort();
          this.$emit("input", !this.valueCom);
          this.$emit("update:modelValue", !this.valueCom);
          this.$nextTick(() => {
            this.$emit("change", this.valueCom ? this.activeValue : this.inactiveValue);
          });
        }
      }
    }
  };
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_loading = resolveEasycom(vue.resolveDynamicComponent("u-loading"), __easycom_0$4);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["u-switch", [$options.valueCom == true ? "u-switch--on" : "", $props.disabled ? "u-switch--disabled" : ""]]),
        onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args)),
        style: vue.normalizeStyle([$options.switchStyle])
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: "u-switch__node node-class",
            style: vue.normalizeStyle({
              width: _ctx.$u.addUnit($props.size),
              height: _ctx.$u.addUnit($props.size)
            })
          },
          [
            vue.createVNode(_component_u_loading, {
              show: $props.loading,
              class: "u-switch__loading",
              size: $props.size * 0.6,
              color: $options.loadingColor
            }, null, 8, ["show", "size", "color"])
          ],
          4
          /* STYLE */
        )
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_2 = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__scopeId", "data-v-033901d2"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/uni_modules/vk-uview-ui/components/u-switch/u-switch.vue"]]);
  function broadcast(componentName, eventName, params) {
  }
  const Emitter = {
    methods: {
      /**
       * 派发 (向上查找) (一个)
       * @param componentName // 需要找的组件的名称
       * @param eventName // 事件名称
       * @param params // 需要传递的参数
       */
      dispatch(componentName, eventName, params) {
        let parent = this.$parent || this.$root;
        let name = parent.$options.name;
        while (parent && (!name || name !== componentName)) {
          parent = parent.$parent;
          if (parent) {
            name = parent.$options.name;
          }
        }
        if (parent) {
          parent[eventName](params);
        }
      },
      /**
       * 广播 (向下查找) (广播多个)
       * @param componentName // 需要找的组件的名称
       * @param eventName // 事件名称
       * @param params // 需要传递的参数
       */
      broadcast(componentName, eventName, params) {
        broadcast.call(this, componentName, eventName, params);
      }
    }
  };
  const _sfc_main$k = {
    name: "u-input",
    emits: ["update:modelValue", "input", "change", "confirm", "clear", "blur", "focus", "click", "touchstart"],
    mixins: [Emitter],
    props: {
      value: {
        type: [String, Number],
        default: ""
      },
      modelValue: {
        type: [String, Number],
        default: ""
      },
      // 输入框的类型，textarea，text，number
      type: {
        type: String,
        default: "text"
      },
      inputAlign: {
        type: String,
        default: ""
      },
      placeholder: {
        type: String,
        default: "请输入内容"
      },
      disabled: {
        type: Boolean,
        default: false
      },
      maxlength: {
        type: [Number, String],
        default: 140
      },
      placeholderStyle: {
        type: String,
        default: "color: #c0c4cc;"
      },
      confirmType: {
        type: String,
        default: "done"
      },
      // 输入框的自定义样式
      customStyle: {
        type: Object,
        default() {
          return {};
        }
      },
      // 如果 textarea 是在一个 position:fixed 的区域，需要显示指定属性 fixed 为 true
      fixed: {
        type: Boolean,
        default: false
      },
      // 是否自动获得焦点
      focus: {
        type: Boolean,
        default: false
      },
      // 密码类型时，是否显示右侧的密码图标
      passwordIcon: {
        type: Boolean,
        default: true
      },
      // input|textarea是否显示边框
      border: {
        type: Boolean,
        default: false
      },
      // 输入框的边框颜色
      borderColor: {
        type: String,
        default: "#dcdfe6"
      },
      autoHeight: {
        type: Boolean,
        default: true
      },
      // type=select时，旋转右侧的图标，标识当前处于打开还是关闭select的状态
      // open-打开，close-关闭
      selectOpen: {
        type: Boolean,
        default: false
      },
      // 高度，单位rpx
      height: {
        type: [Number, String],
        default: ""
      },
      // 是否可清空
      clearable: {
        type: [Boolean, String]
      },
      // 指定光标与键盘的距离，单位 px
      cursorSpacing: {
        type: [Number, String],
        default: 0
      },
      // 光标起始位置，自动聚焦时有效，需与selection-end搭配使用
      selectionStart: {
        type: [Number, String],
        default: -1
      },
      // 光标结束位置，自动聚焦时有效，需与selection-start搭配使用
      selectionEnd: {
        type: [Number, String],
        default: -1
      },
      // 是否自动去除两端的空格
      trim: {
        type: Boolean,
        default: true
      },
      // 是否显示键盘上方带有”完成“按钮那一栏
      showConfirmbar: {
        type: Boolean,
        default: true
      },
      // 弹出键盘时是否自动调节高度，uni-app默认值是true
      adjustPosition: {
        type: Boolean,
        default: true
      },
      // input的背景色
      backgroundColor: {
        type: String
      },
      // input的padding
      padding: {
        type: String
      }
    },
    data() {
      return {
        defaultValue: "",
        inputHeight: 70,
        // input的高度
        textareaHeight: 100,
        // textarea的高度
        validateState: false,
        // 当前input的验证状态，用于错误时，边框是否改为红色
        focused: false,
        // 当前是否处于获得焦点的状态
        showPassword: false,
        // 是否预览密码
        lastValue: "",
        // 用于头条小程序，判断@input中，前后的值是否发生了变化，因为头条中文下，按下键没有输入内容，也会触发@input时间
        uForm: {
          inputAlign: "",
          clearable: ""
        },
        showCover: false
      };
    },
    watch: {
      valueCom(nVal, oVal) {
        this.defaultValue = nVal;
        if (nVal != oVal && this.type == "select")
          this.handleInput({
            detail: {
              value: nVal
            }
          });
      },
      defaultValue(nVal, oVal) {
        if (nVal && nVal.length > this.maxlength) {
          setTimeout(() => {
            nVal = nVal.substring(0, this.maxlength);
            this.handleInput({
              detail: {
                value: nVal
              }
            });
          }, 0);
        }
      }
    },
    computed: {
      valueCom() {
        return this.modelValue;
      },
      inputAlignCom() {
        return this.inputAlign || this.uForm.inputAlign || "left";
      },
      clearableCom() {
        if (typeof this.clearable == "boolean")
          return this.clearable;
        if (typeof this.uForm.clearable == "boolean")
          return this.uForm.clearable;
        return true;
      },
      // 因为uniapp的input组件的maxlength组件必须要数值，这里转为数值，给用户可以传入字符串数值
      inputMaxlength() {
        return Number(this.maxlength);
      },
      getStyle() {
        let style = {};
        style.minHeight = this.height ? this.height + "rpx" : this.type == "textarea" ? this.textareaHeight + "rpx" : this.inputHeight + "rpx";
        style = Object.assign(style, this.customStyle);
        return style;
      },
      //
      getCursorSpacing() {
        return Number(this.cursorSpacing);
      },
      // 光标起始位置
      uSelectionStart() {
        return String(this.selectionStart);
      },
      // 光标结束位置
      uSelectionEnd() {
        return String(this.selectionEnd);
      }
    },
    created() {
      this.defaultValue = this.valueCom;
    },
    mounted() {
      let parent = this.$u.$parent.call(this, "u-form");
      if (parent) {
        Object.keys(this.uForm).map((key) => {
          this.uForm[key] = parent[key];
        });
      }
    },
    methods: {
      /**
       * change 事件
       * @param event
       */
      handleInput(event) {
        let value = event.detail.value;
        if (this.trim)
          value = this.$u.trim(value);
        this.$emit("input", value);
        this.$emit("update:modelValue", value);
        this.defaultValue = value;
        setTimeout(() => {
          this.dispatch("u-form-item", "onFieldChange", value);
        }, 40);
      },
      /**
       * blur 事件
       * @param event
       */
      handleBlur(event) {
        setTimeout(() => {
          this.focused = false;
        }, 100);
        let value = event.detail.value;
        this.$emit("blur", value);
        setTimeout(() => {
          this.dispatch("u-form-item", "onFieldBlur", value);
        }, 40);
      },
      onFormItemError(status) {
        this.validateState = status;
      },
      onFocus(event) {
        this.focused = true;
        this.$emit("focus");
      },
      onConfirm(e2) {
        this.$emit("confirm", e2.detail.value);
      },
      onClear(event) {
        this.$emit("input", "");
        this.$emit("update:modelValue", "");
        this.$emit("clear");
      },
      inputClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_icon = resolveEasycom(vue.resolveDynamicComponent("u-icon"), __easycom_0$6);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["u-input", {
          "u-input--border": $props.border,
          "u-input--error": $data.validateState
        }]),
        style: vue.normalizeStyle({
          padding: $props.padding ? $props.padding : `0 ${$props.border ? 20 : 0}rpx`,
          borderColor: $props.borderColor,
          textAlign: $options.inputAlignCom,
          backgroundColor: $props.backgroundColor
        }),
        onClick: _cache[11] || (_cache[11] = vue.withModifiers((...args) => $options.inputClick && $options.inputClick(...args), ["stop"]))
      },
      [
        $props.type == "textarea" ? (vue.openBlock(), vue.createElementBlock("textarea", {
          key: 0,
          class: "u-input__input u-input__textarea",
          style: vue.normalizeStyle([$options.getStyle]),
          value: $data.defaultValue,
          placeholder: $props.placeholder,
          placeholderStyle: $props.placeholderStyle,
          disabled: $props.disabled,
          fixed: $props.fixed,
          focus: $props.focus,
          maxlength: -1,
          autoHeight: $props.autoHeight,
          "selection-end": $options.uSelectionEnd,
          "selection-start": $options.uSelectionStart,
          "cursor-spacing": $options.getCursorSpacing,
          "show-confirm-bar": $props.showConfirmbar,
          "adjust-position": $props.adjustPosition,
          onInput: _cache[0] || (_cache[0] = (...args) => $options.handleInput && $options.handleInput(...args)),
          onBlur: _cache[1] || (_cache[1] = (...args) => $options.handleBlur && $options.handleBlur(...args)),
          onFocus: _cache[2] || (_cache[2] = (...args) => $options.onFocus && $options.onFocus(...args)),
          onConfirm: _cache[3] || (_cache[3] = (...args) => $options.onConfirm && $options.onConfirm(...args))
        }, null, 44, ["value", "placeholder", "placeholderStyle", "disabled", "fixed", "focus", "autoHeight", "selection-end", "selection-start", "cursor-spacing", "show-confirm-bar", "adjust-position"])) : (vue.openBlock(), vue.createElementBlock("input", {
          key: 1,
          class: vue.normalizeClass(["u-input__input", "u-input__" + $props.type]),
          type: $props.type == "password" ? "text" : $props.type,
          style: vue.normalizeStyle([$options.getStyle]),
          value: $data.defaultValue,
          maxlength: 1e4,
          password: $props.type == "password" && !$data.showPassword,
          placeholder: $props.placeholder,
          placeholderStyle: $props.placeholderStyle,
          disabled: $props.disabled || $props.type === "select" && !$data.showCover,
          focus: $props.focus,
          confirmType: $props.confirmType,
          "cursor-spacing": $options.getCursorSpacing,
          "selection-end": $options.uSelectionEnd,
          "selection-start": $options.uSelectionStart,
          "show-confirm-bar": $props.showConfirmbar,
          "adjust-position": $props.adjustPosition,
          onFocus: _cache[4] || (_cache[4] = (...args) => $options.onFocus && $options.onFocus(...args)),
          onBlur: _cache[5] || (_cache[5] = (...args) => $options.handleBlur && $options.handleBlur(...args)),
          onInput: _cache[6] || (_cache[6] = (...args) => $options.handleInput && $options.handleInput(...args)),
          onConfirm: _cache[7] || (_cache[7] = (...args) => $options.onConfirm && $options.onConfirm(...args))
        }, null, 46, ["type", "value", "password", "placeholder", "placeholderStyle", "disabled", "focus", "confirmType", "cursor-spacing", "selection-end", "selection-start", "show-confirm-bar", "adjust-position"])),
        $props.type === "select" && $data.showCover ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "cover-input",
          onClick: _cache[8] || (_cache[8] = vue.withModifiers((...args) => $options.inputClick && $options.inputClick(...args), ["stop"]))
        })) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "u-input__right-icon u-flex" }, [
          $options.clearableCom && $options.valueCom != "" && $data.focused ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "u-input__right-icon__clear u-input__right-icon__item",
            onClick: _cache[9] || (_cache[9] = (...args) => $options.onClear && $options.onClear(...args))
          }, [
            vue.createVNode(_component_u_icon, {
              size: "32",
              name: "close-circle-fill",
              color: "#c0c4cc"
            })
          ])) : vue.createCommentVNode("v-if", true),
          $props.passwordIcon && $props.type == "password" ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "u-input__right-icon__clear u-input__right-icon__item"
          }, [
            vue.createVNode(_component_u_icon, {
              size: "32",
              name: !$data.showPassword ? "eye" : "eye-fill",
              color: "#c0c4cc",
              onClick: _cache[10] || (_cache[10] = ($event) => $data.showPassword = !$data.showPassword)
            }, null, 8, ["name"])
          ])) : vue.createCommentVNode("v-if", true),
          $props.type == "select" ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 2,
              class: vue.normalizeClass(["u-input__right-icon--select u-input__right-icon__item", {
                "u-input__right-icon--select--reverse": $props.selectOpen
              }])
            },
            [
              vue.createVNode(_component_u_icon, {
                name: "arrow-down-fill",
                size: "26",
                color: "#c0c4cc"
              })
            ],
            2
            /* CLASS */
          )) : vue.createCommentVNode("v-if", true)
        ])
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_3 = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__scopeId", "data-v-dc846cb1"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/uni_modules/vk-uview-ui/components/u-input/u-input.vue"]]);
  const _sfc_main$j = {
    name: "u-radio",
    emits: ["change"],
    props: {
      // radio的名称
      name: {
        type: [String, Number],
        default: ""
      },
      // 组件的整体大小
      size: {
        type: [String, Number],
        default: 34
      },
      // 形状，square为方形，circle为原型
      shape: {
        type: String,
        default: ""
      },
      // 是否禁用
      disabled: {
        type: [String, Boolean],
        default: ""
      },
      // 是否禁止点击提示语选中复选框
      labelDisabled: {
        type: [String, Boolean],
        default: ""
      },
      // 选中状态下的颜色，如设置此值，将会覆盖parent的activeColor值
      activeColor: {
        type: String,
        default: ""
      },
      // 图标的大小，单位rpx
      iconSize: {
        type: [String, Number],
        default: ""
      },
      // label的字体大小，rpx单位
      labelSize: {
        type: [String, Number],
        default: ""
      }
    },
    data() {
      return {
        // 父组件的默认值，因为头条小程序不支持在computed中使用this.parent.shape的形式
        // 故只能使用如此方法
        parentData: {
          iconSize: null,
          labelDisabled: null,
          disabled: null,
          shape: null,
          activeColor: null,
          size: null,
          width: null,
          height: null,
          value: null,
          wrap: null,
          modelValue: null
        }
      };
    },
    created() {
      this.parent = false;
      this.updateParentData();
      this.parent.children.push(this);
    },
    computed: {
      // 是否禁用，如果父组件u-raios-group禁用的话，将会忽略子组件的配置
      elDisabled() {
        return this.disabled !== "" ? this.disabled : this.parentData.disabled !== null ? this.parentData.disabled : false;
      },
      // 是否禁用label点击
      elLabelDisabled() {
        return this.labelDisabled !== "" ? this.labelDisabled : this.parentData.labelDisabled !== null ? this.parentData.labelDisabled : false;
      },
      // 组件尺寸，对应size的值，默认值为34rpx
      elSize() {
        return this.size ? this.size : this.parentData.size ? this.parentData.size : 34;
      },
      // 组件的勾选图标的尺寸，默认20
      elIconSize() {
        return this.iconSize ? this.iconSize : this.parentData.iconSize ? this.parentData.iconSize : 20;
      },
      // 组件选中激活时的颜色
      elActiveColor() {
        return this.activeColor ? this.activeColor : this.parentData.activeColor ? this.parentData.activeColor : "primary";
      },
      // 组件的形状
      elShape() {
        return this.shape ? this.shape : this.parentData.shape ? this.parentData.shape : "circle";
      },
      // 设置radio的状态，要求radio的name等于parent的value时才为选中状态
      iconStyle() {
        let style = {};
        if (this.elActiveColor && this.parentData.value === this.name && !this.elDisabled) {
          style.borderColor = this.elActiveColor;
          style.backgroundColor = this.elActiveColor;
        }
        style.width = this.$u.addUnit(this.elSize);
        style.height = this.$u.addUnit(this.elSize);
        return style;
      },
      iconColor() {
        return this.name === this.parentData.value ? "#ffffff" : "transparent";
      },
      iconClass() {
        let classes = [];
        classes.push("u-radio__icon-wrap--" + this.elShape);
        if (this.name === this.parentData.value)
          classes.push("u-radio__icon-wrap--checked");
        if (this.elDisabled)
          classes.push("u-radio__icon-wrap--disabled");
        if (this.name === this.parentData.value && this.elDisabled)
          classes.push("u-radio__icon-wrap--disabled--checked");
        return classes.join(" ");
      },
      radioStyle() {
        let style = {};
        if (this.parentData.width) {
          style.width = this.$u.addUnit(this.parentData.width);
          style.flex = `0 0 ${this.$u.addUnit(this.parentData.width)}`;
        }
        if (this.parentData.wrap) {
          style.width = "100%";
          style.flex = "0 0 100%";
        }
        return style;
      }
    },
    methods: {
      updateParentData() {
        this.getParentData("u-radio-group");
      },
      onClickLabel() {
        if (!this.elLabelDisabled && !this.elDisabled) {
          this.setRadioCheckedStatus();
        }
      },
      toggle() {
        if (!this.elDisabled) {
          this.setRadioCheckedStatus();
        }
      },
      emitEvent() {
        if (this.parentData.value != this.name)
          this.$emit("change", this.name);
      },
      // 改变组件选中状态
      // 这里的改变的依据是，更改本组件的parentData.value值为本组件的name值，同时通过父组件遍历所有u-radio实例
      // 将本组件外的其他u-radio的parentData.value都设置为空(由computed计算后，都被取消选中状态)，因而只剩下一个为选中状态
      setRadioCheckedStatus() {
        this.emitEvent();
        if (this.parent) {
          this.parent.setValue(this.name);
          this.parentData.value = this.name;
        }
      }
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_icon = resolveEasycom(vue.resolveDynamicComponent("u-icon"), __easycom_0$6);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "u-radio",
        style: vue.normalizeStyle([$options.radioStyle])
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["u-radio__icon-wrap", [$options.iconClass]]),
            onClick: _cache[0] || (_cache[0] = (...args) => $options.toggle && $options.toggle(...args)),
            style: vue.normalizeStyle([$options.iconStyle])
          },
          [
            vue.createVNode(_component_u_icon, {
              class: "u-radio__icon-wrap__icon",
              name: "checkbox-mark",
              size: $options.elIconSize,
              color: $options.iconColor
            }, null, 8, ["size", "color"])
          ],
          6
          /* CLASS, STYLE */
        ),
        vue.createElementVNode(
          "view",
          {
            class: "u-radio__label",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.onClickLabel && $options.onClickLabel(...args)),
            style: vue.normalizeStyle({ fontSize: _ctx.$u.addUnit($props.labelSize) })
          },
          [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ],
          4
          /* STYLE */
        )
      ],
      4
      /* STYLE */
    );
  }
  const __easycom_4 = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__scopeId", "data-v-3d838a1d"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/uni_modules/vk-uview-ui/components/u-radio/u-radio.vue"]]);
  const _sfc_main$i = {
    name: "u-radio-group",
    emits: ["update:modelValue", "input", "change"],
    mixins: [Emitter],
    props: {
      // 匹配某一个radio组件，如果某个radio的name值等于此值，那么这个radio就被会选中
      value: {
        type: [String, Number, Array, Boolean],
        default: ""
      },
      modelValue: {
        type: [String, Number, Array, Boolean],
        default: ""
      },
      // 是否禁用所有单选框
      disabled: {
        type: Boolean,
        default: false
      },
      // 选中状态下的颜色
      activeColor: {
        type: String,
        default: "#2979ff"
      },
      // 组件的整体大小
      size: {
        type: [String, Number],
        default: 34
      },
      // 是否禁止点击提示语选中复选框
      labelDisabled: {
        type: Boolean,
        default: false
      },
      // 形状，square为方形，circle为圆型
      shape: {
        type: String,
        default: "circle"
      },
      // 图标的大小，单位rpx
      iconSize: {
        type: [String, Number],
        default: 20
      },
      // 每个checkbox占u-checkbox-group的宽度
      width: {
        type: [String, Number],
        default: "auto"
      },
      // 是否每个checkbox都换行
      wrap: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        uFromData: {
          inputAlign: "left"
        }
      };
    },
    created() {
      this.children = [];
    },
    mounted() {
      let parent = this.$u.$parent.call(this, "u-form");
      if (parent) {
        Object.keys(this.uFromData).map((key) => {
          this.uFromData[key] = parent[key];
        });
      }
    },
    watch: {
      // 当父组件需要子组件需要共享的参数发生了变化，手动通知子组件
      parentData() {
        if (this.children.length) {
          this.children.map((child) => {
            typeof child.updateParentData == "function" && child.updateParentData();
          });
        }
      }
    },
    computed: {
      valueCom() {
        return this.modelValue;
      },
      // 这里computed的变量，都是子组件u-radio需要用到的，由于头条小程序的兼容性差异，子组件无法实时监听父组件参数的变化
      // 所以需要手动通知子组件，这里返回一个parentData变量，供watch监听，在其中去通知每一个子组件重新从父组件(u-radio-group)
      // 拉取父组件新的变化后的参数
      parentData() {
        return [
          this.value,
          this.disabled,
          this.activeColor,
          this.size,
          this.labelDisabled,
          this.shape,
          this.iconSize,
          this.width,
          this.wrap,
          this.modelValue
        ];
      }
    },
    methods: {
      // 该方法有子组件radio调用，当一个radio被选中的时候，给父组件设置value值(props传递的value)
      setValue(val) {
        this.children.map((child) => {
          if (child.parentData.value != val)
            child.parentData.value = "";
        });
        this.$emit("input", val);
        this.$emit("update:modelValue", val);
        this.$emit("change", val);
        setTimeout(() => {
          this.dispatch("u-form-item", "onFieldChange", val);
        }, 60);
      }
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["u-radio-group u-clearfix", $data.uFromData.inputAlign == "right" ? "flex-end" : ""])
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      2
      /* CLASS */
    );
  }
  const __easycom_5 = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__scopeId", "data-v-1d03092d"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/uni_modules/vk-uview-ui/components/u-radio-group/u-radio-group.vue"]]);
  const _sfc_main$h = {
    name: "u-button",
    emits: ["click", "getphonenumber", "getuserinfo", "error", "opensetting", "launchapp", "chooseavatar"],
    props: {
      // 是否细边框
      hairLine: {
        type: Boolean,
        default: true
      },
      // 按钮的预置样式，default，primary，error，warning，success
      type: {
        type: String,
        default: "default"
      },
      // 按钮尺寸，default，medium，mini
      size: {
        type: String,
        default: "default"
      },
      // 按钮形状，circle（两边为半圆），square（带圆角）
      shape: {
        type: String,
        default: "square"
      },
      // 按钮是否镂空
      plain: {
        type: Boolean,
        default: false
      },
      // 是否禁止状态
      disabled: {
        type: Boolean,
        default: false
      },
      // 是否加载中
      loading: {
        type: Boolean,
        default: false
      },
      // 开放能力，具体请看uniapp稳定关于button组件部分说明
      // https://uniapp.dcloud.io/component/button
      openType: {
        type: String,
        default: ""
      },
      // 用于 <form> 组件，点击分别会触发 <form> 组件的 submit/reset 事件
      // 取值为submit（提交表单），reset（重置表单）
      formType: {
        type: String,
        default: ""
      },
      // 打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效
      // 只微信小程序、QQ小程序有效
      appParameter: {
        type: String,
        default: ""
      },
      // 指定是否阻止本节点的祖先节点出现点击态，微信小程序有效
      hoverStopPropagation: {
        type: Boolean,
        default: false
      },
      // 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。只微信小程序有效
      lang: {
        type: String,
        default: "en"
      },
      // 会话来源，open-type="contact"时有效。只微信小程序有效
      sessionFrom: {
        type: String,
        default: ""
      },
      // 会话内消息卡片标题，open-type="contact"时有效
      // 默认当前标题，只微信小程序有效
      sendMessageTitle: {
        type: String,
        default: ""
      },
      // 会话内消息卡片点击跳转小程序路径，open-type="contact"时有效
      // 默认当前分享路径，只微信小程序有效
      sendMessagePath: {
        type: String,
        default: ""
      },
      // 会话内消息卡片图片，open-type="contact"时有效
      // 默认当前页面截图，只微信小程序有效
      sendMessageImg: {
        type: String,
        default: ""
      },
      // 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，
      // 用户点击后可以快速发送小程序消息，open-type="contact"时有效
      showMessageCard: {
        type: Boolean,
        default: false
      },
      // 手指按（触摸）按钮时按钮时的背景颜色
      hoverBgColor: {
        type: String,
        default: ""
      },
      // 水波纹的背景颜色
      rippleBgColor: {
        type: String,
        default: ""
      },
      // 是否开启水波纹效果
      ripple: {
        type: Boolean,
        default: false
      },
      // 按下的类名
      hoverClass: {
        type: String,
        default: ""
      },
      // 自定义样式，对象形式
      customStyle: {
        type: Object,
        default() {
          return {};
        }
      },
      // 额外传参参数，用于小程序的data-xxx属性，通过target.dataset.name获取
      dataName: {
        type: String,
        default: ""
      },
      // 节流，一定时间内只能触发一次
      throttleTime: {
        type: [String, Number],
        default: 500
      },
      // 按住后多久出现点击态，单位毫秒
      hoverStartTime: {
        type: [String, Number],
        default: 20
      },
      // 手指松开后点击态保留时间，单位毫秒
      hoverStayTime: {
        type: [String, Number],
        default: 150
      },
      timerId: {
        type: [String, Number]
      }
    },
    computed: {
      // 当没有传bgColor变量时，按钮按下去的颜色类名
      getHoverClass() {
        if (this.loading || this.disabled || this.ripple || this.hoverClass)
          return "";
        let hoverClass = "";
        hoverClass = this.plain ? "u-" + this.type + "-plain-hover" : "u-" + this.type + "-hover";
        return hoverClass;
      },
      // 在'primary', 'success', 'error', 'warning'类型下，不显示边框，否则会造成四角有毛刺现象
      showHairLineBorder() {
        if (["primary", "success", "error", "warning"].indexOf(this.type) >= 0 && !this.plain) {
          return "";
        } else {
          return "u-hairline-border";
        }
      }
    },
    data() {
      let btnTimerId = this.timerId || "button_" + Math.floor(Math.random() * 1e8 + 0);
      return {
        btnTimerId,
        rippleTop: 0,
        // 水波纹的起点Y坐标到按钮上边界的距离
        rippleLeft: 0,
        // 水波纹起点X坐标到按钮左边界的距离
        fields: {},
        // 波纹按钮节点信息
        waveActive: false
        // 激活水波纹
      };
    },
    methods: {
      // 按钮点击
      click(e2) {
        this.$u.throttle(() => {
          if (this.loading === true || this.disabled === true)
            return;
          if (this.ripple) {
            this.waveActive = false;
            this.$nextTick(function() {
              this.getWaveQuery(e2);
            });
          }
          this.$emit("click", e2);
        }, this.throttleTime, true, this.btnTimerId);
      },
      // 查询按钮的节点信息
      getWaveQuery(e2) {
        this.getElQuery().then((res) => {
          let data = res[0];
          if (!data.width || !data.width)
            return;
          data.targetWidth = data.height > data.width ? data.height : data.width;
          if (!data.targetWidth)
            return;
          this.fields = data;
          let touchesX = "", touchesY = "";
          touchesX = e2.touches[0].clientX;
          touchesY = e2.touches[0].clientY;
          this.rippleTop = touchesY - data.top - data.targetWidth / 2;
          this.rippleLeft = touchesX - data.left - data.targetWidth / 2;
          this.$nextTick(() => {
            this.waveActive = true;
          });
        });
      },
      // 获取节点信息
      getElQuery() {
        return new Promise((resolve) => {
          let queryInfo = "";
          queryInfo = uni.createSelectorQuery().in(this);
          queryInfo.select(".u-btn").boundingClientRect();
          queryInfo.exec((data) => {
            resolve(data);
          });
        });
      },
      // 下面为对接uniapp官方按钮开放能力事件回调的对接
      getphonenumber(res) {
        this.$emit("getphonenumber", res);
      },
      getuserinfo(res) {
        this.$emit("getuserinfo", res);
      },
      error(res) {
        this.$emit("error", res);
      },
      opensetting(res) {
        this.$emit("opensetting", res);
      },
      launchapp(res) {
        this.$emit("launchapp", res);
      },
      chooseavatar(res) {
        this.$emit("chooseavatar", res);
      }
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("button", {
      id: "u-wave-btn",
      class: vue.normalizeClass(["u-btn u-line-1 u-fix-ios-appearance", [
        "u-size-" + $props.size,
        $props.plain ? "u-btn--" + $props.type + "--plain" : "",
        $props.loading ? "u-loading" : "",
        $props.shape == "circle" ? "u-round-circle" : "",
        $props.hairLine ? $options.showHairLineBorder : "u-btn--bold-border",
        "u-btn--" + $props.type,
        $props.disabled ? `u-btn--${$props.type}--disabled` : ""
      ]]),
      "hover-start-time": Number($props.hoverStartTime),
      "hover-stay-time": Number($props.hoverStayTime),
      disabled: $props.disabled,
      "form-type": $props.formType,
      "open-type": $props.openType,
      "app-parameter": $props.appParameter,
      "hover-stop-propagation": $props.hoverStopPropagation,
      "send-message-title": $props.sendMessageTitle,
      "send-message-path": "sendMessagePath",
      lang: $props.lang,
      "data-name": $props.dataName,
      "session-from": $props.sessionFrom,
      "send-message-img": $props.sendMessageImg,
      "show-message-card": $props.showMessageCard,
      onGetphonenumber: _cache[0] || (_cache[0] = (...args) => $options.getphonenumber && $options.getphonenumber(...args)),
      onGetuserinfo: _cache[1] || (_cache[1] = (...args) => $options.getuserinfo && $options.getuserinfo(...args)),
      onError: _cache[2] || (_cache[2] = (...args) => $options.error && $options.error(...args)),
      onOpensetting: _cache[3] || (_cache[3] = (...args) => $options.opensetting && $options.opensetting(...args)),
      onLaunchapp: _cache[4] || (_cache[4] = (...args) => $options.launchapp && $options.launchapp(...args)),
      onChooseavatar: _cache[5] || (_cache[5] = (...args) => $options.chooseavatar && $options.chooseavatar(...args)),
      style: vue.normalizeStyle([$props.customStyle, {
        overflow: $props.ripple ? "hidden" : "visible"
      }]),
      onClick: _cache[6] || (_cache[6] = vue.withModifiers(($event) => $options.click($event), ["stop"])),
      "hover-class": $options.getHoverClass,
      loading: $props.loading
    }, [
      vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
      $props.ripple ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          class: vue.normalizeClass(["u-wave-ripple", [$data.waveActive ? "u-wave-active" : ""]]),
          style: vue.normalizeStyle({
            top: $data.rippleTop + "px",
            left: $data.rippleLeft + "px",
            width: $data.fields.targetWidth + "px",
            height: $data.fields.targetWidth + "px",
            "background-color": $props.rippleBgColor || "rgba(0, 0, 0, 0.15)"
          })
        },
        null,
        6
        /* CLASS, STYLE */
      )) : vue.createCommentVNode("v-if", true)
    ], 46, ["hover-start-time", "hover-stay-time", "disabled", "form-type", "open-type", "app-parameter", "hover-stop-propagation", "send-message-title", "lang", "data-name", "session-from", "send-message-img", "show-message-card", "hover-class", "loading"]);
  }
  const __easycom_6 = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__scopeId", "data-v-097def2b"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/uni_modules/vk-uview-ui/components/u-button/u-button.vue"]]);
  const pages = [
    {
      path: "pages/index/Login",
      style: {
        navigationBarTitleText: "登录"
      }
    },
    {
      path: "pages/index/SelectBuilding",
      style: {
        navigationBarTitleText: "建筑选择"
      }
    },
    {
      path: "pages/index/Building1",
      style: {
        navigationBarTitleText: "同济大学综合楼"
      }
    },
    {
      path: "pages/index/Building2",
      style: {
        navigationBarTitleText: "同济大学A楼"
      }
    },
    {
      path: "pages/index/SensorDetail8",
      style: {
        navigationBarTitleText: "同济大厦A楼04设备",
        "app-plus": {
          titleNView: {
            buttons: [
              {
                text: "设置",
                type: "none",
                fontSize: "20px"
              }
            ]
          }
        }
      }
    },
    {
      path: "pages/index/SensorDetail9",
      style: {
        navigationBarTitleText: "同济大厦A楼03设备",
        "app-plus": {
          titleNView: {
            buttons: [
              {
                text: "设置",
                type: "none",
                fontSize: "16px"
              }
            ]
          }
        }
      }
    },
    {
      path: "pages/index/SensorDetail10",
      style: {
        navigationBarTitleText: "同济大厦A楼02设备",
        "app-plus": {
          titleNView: {
            buttons: [
              {
                text: "设置",
                type: "none",
                fontSize: "16px"
              }
            ]
          }
        }
      }
    },
    {
      path: "pages/index/Guide",
      style: {
        navigationBarTitleText: "欢迎登录"
      }
    },
    {
      path: "pages/abnormal/AbnormalGuide",
      style: {
        navigationBarTitleText: "异常数据选择"
      }
    },
    {
      path: "pages/abnormal/Building1",
      style: {
        navigationBarTitleText: "综合楼异常数据"
      }
    },
    {
      path: "pages/abnormal/Building2",
      style: {
        navigationBarTitleText: "A楼异常数据"
      }
    }
  ];
  const globalStyle = {
    navigationBarTextStyle: "black",
    navigationBarTitleText: "uni-app",
    navigationBarBackgroundColor: "#F8F8F8",
    backgroundColor: "#F8F8F8"
  };
  const uniIdRouter = {};
  const easycom = {
    "^u-(.*)": "@/uni_modules/vk-uview-ui/components/u-$1/u-$1.vue"
  };
  const e = {
    pages,
    globalStyle,
    uniIdRouter,
    easycom
  };
  var define_process_env_UNI_SECURE_NETWORK_CONFIG_default = [];
  function t(e2) {
    return e2 && e2.__esModule && Object.prototype.hasOwnProperty.call(e2, "default") ? e2.default : e2;
  }
  function n(e2, t2, n2) {
    return e2(n2 = { path: t2, exports: {}, require: function(e3, t3) {
      return function() {
        throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
      }(null == t3 && n2.path);
    } }, n2.exports), n2.exports;
  }
  var s = n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = n2 || function(e3, t3) {
      var n3 = Object.create || /* @__PURE__ */ function() {
        function e4() {
        }
        return function(t4) {
          var n4;
          return e4.prototype = t4, n4 = new e4(), e4.prototype = null, n4;
        };
      }(), s2 = {}, r2 = s2.lib = {}, i2 = r2.Base = { extend: function(e4) {
        var t4 = n3(this);
        return e4 && t4.mixIn(e4), t4.hasOwnProperty("init") && this.init !== t4.init || (t4.init = function() {
          t4.$super.init.apply(this, arguments);
        }), t4.init.prototype = t4, t4.$super = this, t4;
      }, create: function() {
        var e4 = this.extend();
        return e4.init.apply(e4, arguments), e4;
      }, init: function() {
      }, mixIn: function(e4) {
        for (var t4 in e4)
          e4.hasOwnProperty(t4) && (this[t4] = e4[t4]);
        e4.hasOwnProperty("toString") && (this.toString = e4.toString);
      }, clone: function() {
        return this.init.prototype.extend(this);
      } }, o2 = r2.WordArray = i2.extend({ init: function(e4, n4) {
        e4 = this.words = e4 || [], this.sigBytes = n4 != t3 ? n4 : 4 * e4.length;
      }, toString: function(e4) {
        return (e4 || c2).stringify(this);
      }, concat: function(e4) {
        var t4 = this.words, n4 = e4.words, s3 = this.sigBytes, r3 = e4.sigBytes;
        if (this.clamp(), s3 % 4)
          for (var i3 = 0; i3 < r3; i3++) {
            var o3 = n4[i3 >>> 2] >>> 24 - i3 % 4 * 8 & 255;
            t4[s3 + i3 >>> 2] |= o3 << 24 - (s3 + i3) % 4 * 8;
          }
        else
          for (i3 = 0; i3 < r3; i3 += 4)
            t4[s3 + i3 >>> 2] = n4[i3 >>> 2];
        return this.sigBytes += r3, this;
      }, clamp: function() {
        var t4 = this.words, n4 = this.sigBytes;
        t4[n4 >>> 2] &= 4294967295 << 32 - n4 % 4 * 8, t4.length = e3.ceil(n4 / 4);
      }, clone: function() {
        var e4 = i2.clone.call(this);
        return e4.words = this.words.slice(0), e4;
      }, random: function(t4) {
        for (var n4, s3 = [], r3 = function(t5) {
          var n5 = 987654321, s4 = 4294967295;
          return function() {
            var r4 = ((n5 = 36969 * (65535 & n5) + (n5 >> 16) & s4) << 16) + (t5 = 18e3 * (65535 & t5) + (t5 >> 16) & s4) & s4;
            return r4 /= 4294967296, (r4 += 0.5) * (e3.random() > 0.5 ? 1 : -1);
          };
        }, i3 = 0; i3 < t4; i3 += 4) {
          var a3 = r3(4294967296 * (n4 || e3.random()));
          n4 = 987654071 * a3(), s3.push(4294967296 * a3() | 0);
        }
        return new o2.init(s3, t4);
      } }), a2 = s2.enc = {}, c2 = a2.Hex = { stringify: function(e4) {
        for (var t4 = e4.words, n4 = e4.sigBytes, s3 = [], r3 = 0; r3 < n4; r3++) {
          var i3 = t4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
          s3.push((i3 >>> 4).toString(16)), s3.push((15 & i3).toString(16));
        }
        return s3.join("");
      }, parse: function(e4) {
        for (var t4 = e4.length, n4 = [], s3 = 0; s3 < t4; s3 += 2)
          n4[s3 >>> 3] |= parseInt(e4.substr(s3, 2), 16) << 24 - s3 % 8 * 4;
        return new o2.init(n4, t4 / 2);
      } }, u2 = a2.Latin1 = { stringify: function(e4) {
        for (var t4 = e4.words, n4 = e4.sigBytes, s3 = [], r3 = 0; r3 < n4; r3++) {
          var i3 = t4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
          s3.push(String.fromCharCode(i3));
        }
        return s3.join("");
      }, parse: function(e4) {
        for (var t4 = e4.length, n4 = [], s3 = 0; s3 < t4; s3++)
          n4[s3 >>> 2] |= (255 & e4.charCodeAt(s3)) << 24 - s3 % 4 * 8;
        return new o2.init(n4, t4);
      } }, h2 = a2.Utf8 = { stringify: function(e4) {
        try {
          return decodeURIComponent(escape(u2.stringify(e4)));
        } catch (e5) {
          throw new Error("Malformed UTF-8 data");
        }
      }, parse: function(e4) {
        return u2.parse(unescape(encodeURIComponent(e4)));
      } }, l2 = r2.BufferedBlockAlgorithm = i2.extend({ reset: function() {
        this._data = new o2.init(), this._nDataBytes = 0;
      }, _append: function(e4) {
        "string" == typeof e4 && (e4 = h2.parse(e4)), this._data.concat(e4), this._nDataBytes += e4.sigBytes;
      }, _process: function(t4) {
        var n4 = this._data, s3 = n4.words, r3 = n4.sigBytes, i3 = this.blockSize, a3 = r3 / (4 * i3), c3 = (a3 = t4 ? e3.ceil(a3) : e3.max((0 | a3) - this._minBufferSize, 0)) * i3, u3 = e3.min(4 * c3, r3);
        if (c3) {
          for (var h3 = 0; h3 < c3; h3 += i3)
            this._doProcessBlock(s3, h3);
          var l3 = s3.splice(0, c3);
          n4.sigBytes -= u3;
        }
        return new o2.init(l3, u3);
      }, clone: function() {
        var e4 = i2.clone.call(this);
        return e4._data = this._data.clone(), e4;
      }, _minBufferSize: 0 });
      r2.Hasher = l2.extend({ cfg: i2.extend(), init: function(e4) {
        this.cfg = this.cfg.extend(e4), this.reset();
      }, reset: function() {
        l2.reset.call(this), this._doReset();
      }, update: function(e4) {
        return this._append(e4), this._process(), this;
      }, finalize: function(e4) {
        return e4 && this._append(e4), this._doFinalize();
      }, blockSize: 16, _createHelper: function(e4) {
        return function(t4, n4) {
          return new e4.init(n4).finalize(t4);
        };
      }, _createHmacHelper: function(e4) {
        return function(t4, n4) {
          return new d2.HMAC.init(e4, n4).finalize(t4);
        };
      } });
      var d2 = s2.algo = {};
      return s2;
    }(Math), n2);
  }), r = s, i = (n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = r, function(e3) {
      var t3 = n2, s2 = t3.lib, r2 = s2.WordArray, i2 = s2.Hasher, o2 = t3.algo, a2 = [];
      !function() {
        for (var t4 = 0; t4 < 64; t4++)
          a2[t4] = 4294967296 * e3.abs(e3.sin(t4 + 1)) | 0;
      }();
      var c2 = o2.MD5 = i2.extend({ _doReset: function() {
        this._hash = new r2.init([1732584193, 4023233417, 2562383102, 271733878]);
      }, _doProcessBlock: function(e4, t4) {
        for (var n3 = 0; n3 < 16; n3++) {
          var s3 = t4 + n3, r3 = e4[s3];
          e4[s3] = 16711935 & (r3 << 8 | r3 >>> 24) | 4278255360 & (r3 << 24 | r3 >>> 8);
        }
        var i3 = this._hash.words, o3 = e4[t4 + 0], c3 = e4[t4 + 1], p2 = e4[t4 + 2], f2 = e4[t4 + 3], g2 = e4[t4 + 4], m2 = e4[t4 + 5], y2 = e4[t4 + 6], _2 = e4[t4 + 7], w2 = e4[t4 + 8], v2 = e4[t4 + 9], I2 = e4[t4 + 10], S2 = e4[t4 + 11], T2 = e4[t4 + 12], b2 = e4[t4 + 13], E2 = e4[t4 + 14], k2 = e4[t4 + 15], P2 = i3[0], C2 = i3[1], A2 = i3[2], O2 = i3[3];
        P2 = u2(P2, C2, A2, O2, o3, 7, a2[0]), O2 = u2(O2, P2, C2, A2, c3, 12, a2[1]), A2 = u2(A2, O2, P2, C2, p2, 17, a2[2]), C2 = u2(C2, A2, O2, P2, f2, 22, a2[3]), P2 = u2(P2, C2, A2, O2, g2, 7, a2[4]), O2 = u2(O2, P2, C2, A2, m2, 12, a2[5]), A2 = u2(A2, O2, P2, C2, y2, 17, a2[6]), C2 = u2(C2, A2, O2, P2, _2, 22, a2[7]), P2 = u2(P2, C2, A2, O2, w2, 7, a2[8]), O2 = u2(O2, P2, C2, A2, v2, 12, a2[9]), A2 = u2(A2, O2, P2, C2, I2, 17, a2[10]), C2 = u2(C2, A2, O2, P2, S2, 22, a2[11]), P2 = u2(P2, C2, A2, O2, T2, 7, a2[12]), O2 = u2(O2, P2, C2, A2, b2, 12, a2[13]), A2 = u2(A2, O2, P2, C2, E2, 17, a2[14]), P2 = h2(P2, C2 = u2(C2, A2, O2, P2, k2, 22, a2[15]), A2, O2, c3, 5, a2[16]), O2 = h2(O2, P2, C2, A2, y2, 9, a2[17]), A2 = h2(A2, O2, P2, C2, S2, 14, a2[18]), C2 = h2(C2, A2, O2, P2, o3, 20, a2[19]), P2 = h2(P2, C2, A2, O2, m2, 5, a2[20]), O2 = h2(O2, P2, C2, A2, I2, 9, a2[21]), A2 = h2(A2, O2, P2, C2, k2, 14, a2[22]), C2 = h2(C2, A2, O2, P2, g2, 20, a2[23]), P2 = h2(P2, C2, A2, O2, v2, 5, a2[24]), O2 = h2(O2, P2, C2, A2, E2, 9, a2[25]), A2 = h2(A2, O2, P2, C2, f2, 14, a2[26]), C2 = h2(C2, A2, O2, P2, w2, 20, a2[27]), P2 = h2(P2, C2, A2, O2, b2, 5, a2[28]), O2 = h2(O2, P2, C2, A2, p2, 9, a2[29]), A2 = h2(A2, O2, P2, C2, _2, 14, a2[30]), P2 = l2(P2, C2 = h2(C2, A2, O2, P2, T2, 20, a2[31]), A2, O2, m2, 4, a2[32]), O2 = l2(O2, P2, C2, A2, w2, 11, a2[33]), A2 = l2(A2, O2, P2, C2, S2, 16, a2[34]), C2 = l2(C2, A2, O2, P2, E2, 23, a2[35]), P2 = l2(P2, C2, A2, O2, c3, 4, a2[36]), O2 = l2(O2, P2, C2, A2, g2, 11, a2[37]), A2 = l2(A2, O2, P2, C2, _2, 16, a2[38]), C2 = l2(C2, A2, O2, P2, I2, 23, a2[39]), P2 = l2(P2, C2, A2, O2, b2, 4, a2[40]), O2 = l2(O2, P2, C2, A2, o3, 11, a2[41]), A2 = l2(A2, O2, P2, C2, f2, 16, a2[42]), C2 = l2(C2, A2, O2, P2, y2, 23, a2[43]), P2 = l2(P2, C2, A2, O2, v2, 4, a2[44]), O2 = l2(O2, P2, C2, A2, T2, 11, a2[45]), A2 = l2(A2, O2, P2, C2, k2, 16, a2[46]), P2 = d2(P2, C2 = l2(C2, A2, O2, P2, p2, 23, a2[47]), A2, O2, o3, 6, a2[48]), O2 = d2(O2, P2, C2, A2, _2, 10, a2[49]), A2 = d2(A2, O2, P2, C2, E2, 15, a2[50]), C2 = d2(C2, A2, O2, P2, m2, 21, a2[51]), P2 = d2(P2, C2, A2, O2, T2, 6, a2[52]), O2 = d2(O2, P2, C2, A2, f2, 10, a2[53]), A2 = d2(A2, O2, P2, C2, I2, 15, a2[54]), C2 = d2(C2, A2, O2, P2, c3, 21, a2[55]), P2 = d2(P2, C2, A2, O2, w2, 6, a2[56]), O2 = d2(O2, P2, C2, A2, k2, 10, a2[57]), A2 = d2(A2, O2, P2, C2, y2, 15, a2[58]), C2 = d2(C2, A2, O2, P2, b2, 21, a2[59]), P2 = d2(P2, C2, A2, O2, g2, 6, a2[60]), O2 = d2(O2, P2, C2, A2, S2, 10, a2[61]), A2 = d2(A2, O2, P2, C2, p2, 15, a2[62]), C2 = d2(C2, A2, O2, P2, v2, 21, a2[63]), i3[0] = i3[0] + P2 | 0, i3[1] = i3[1] + C2 | 0, i3[2] = i3[2] + A2 | 0, i3[3] = i3[3] + O2 | 0;
      }, _doFinalize: function() {
        var t4 = this._data, n3 = t4.words, s3 = 8 * this._nDataBytes, r3 = 8 * t4.sigBytes;
        n3[r3 >>> 5] |= 128 << 24 - r3 % 32;
        var i3 = e3.floor(s3 / 4294967296), o3 = s3;
        n3[15 + (r3 + 64 >>> 9 << 4)] = 16711935 & (i3 << 8 | i3 >>> 24) | 4278255360 & (i3 << 24 | i3 >>> 8), n3[14 + (r3 + 64 >>> 9 << 4)] = 16711935 & (o3 << 8 | o3 >>> 24) | 4278255360 & (o3 << 24 | o3 >>> 8), t4.sigBytes = 4 * (n3.length + 1), this._process();
        for (var a3 = this._hash, c3 = a3.words, u3 = 0; u3 < 4; u3++) {
          var h3 = c3[u3];
          c3[u3] = 16711935 & (h3 << 8 | h3 >>> 24) | 4278255360 & (h3 << 24 | h3 >>> 8);
        }
        return a3;
      }, clone: function() {
        var e4 = i2.clone.call(this);
        return e4._hash = this._hash.clone(), e4;
      } });
      function u2(e4, t4, n3, s3, r3, i3, o3) {
        var a3 = e4 + (t4 & n3 | ~t4 & s3) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      function h2(e4, t4, n3, s3, r3, i3, o3) {
        var a3 = e4 + (t4 & s3 | n3 & ~s3) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      function l2(e4, t4, n3, s3, r3, i3, o3) {
        var a3 = e4 + (t4 ^ n3 ^ s3) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      function d2(e4, t4, n3, s3, r3, i3, o3) {
        var a3 = e4 + (n3 ^ (t4 | ~s3)) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      t3.MD5 = i2._createHelper(c2), t3.HmacMD5 = i2._createHmacHelper(c2);
    }(Math), n2.MD5);
  }), n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = r, void function() {
      var e3 = n2, t3 = e3.lib.Base, s2 = e3.enc.Utf8;
      e3.algo.HMAC = t3.extend({ init: function(e4, t4) {
        e4 = this._hasher = new e4.init(), "string" == typeof t4 && (t4 = s2.parse(t4));
        var n3 = e4.blockSize, r2 = 4 * n3;
        t4.sigBytes > r2 && (t4 = e4.finalize(t4)), t4.clamp();
        for (var i2 = this._oKey = t4.clone(), o2 = this._iKey = t4.clone(), a2 = i2.words, c2 = o2.words, u2 = 0; u2 < n3; u2++)
          a2[u2] ^= 1549556828, c2[u2] ^= 909522486;
        i2.sigBytes = o2.sigBytes = r2, this.reset();
      }, reset: function() {
        var e4 = this._hasher;
        e4.reset(), e4.update(this._iKey);
      }, update: function(e4) {
        return this._hasher.update(e4), this;
      }, finalize: function(e4) {
        var t4 = this._hasher, n3 = t4.finalize(e4);
        return t4.reset(), t4.finalize(this._oKey.clone().concat(n3));
      } });
    }());
  }), n(function(e2, t2) {
    e2.exports = r.HmacMD5;
  })), o = n(function(e2, t2) {
    e2.exports = r.enc.Utf8;
  }), a = n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = r, function() {
      var e3 = n2, t3 = e3.lib.WordArray;
      function s2(e4, n3, s3) {
        for (var r2 = [], i2 = 0, o2 = 0; o2 < n3; o2++)
          if (o2 % 4) {
            var a2 = s3[e4.charCodeAt(o2 - 1)] << o2 % 4 * 2, c2 = s3[e4.charCodeAt(o2)] >>> 6 - o2 % 4 * 2;
            r2[i2 >>> 2] |= (a2 | c2) << 24 - i2 % 4 * 8, i2++;
          }
        return t3.create(r2, i2);
      }
      e3.enc.Base64 = { stringify: function(e4) {
        var t4 = e4.words, n3 = e4.sigBytes, s3 = this._map;
        e4.clamp();
        for (var r2 = [], i2 = 0; i2 < n3; i2 += 3)
          for (var o2 = (t4[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255) << 16 | (t4[i2 + 1 >>> 2] >>> 24 - (i2 + 1) % 4 * 8 & 255) << 8 | t4[i2 + 2 >>> 2] >>> 24 - (i2 + 2) % 4 * 8 & 255, a2 = 0; a2 < 4 && i2 + 0.75 * a2 < n3; a2++)
            r2.push(s3.charAt(o2 >>> 6 * (3 - a2) & 63));
        var c2 = s3.charAt(64);
        if (c2)
          for (; r2.length % 4; )
            r2.push(c2);
        return r2.join("");
      }, parse: function(e4) {
        var t4 = e4.length, n3 = this._map, r2 = this._reverseMap;
        if (!r2) {
          r2 = this._reverseMap = [];
          for (var i2 = 0; i2 < n3.length; i2++)
            r2[n3.charCodeAt(i2)] = i2;
        }
        var o2 = n3.charAt(64);
        if (o2) {
          var a2 = e4.indexOf(o2);
          -1 !== a2 && (t4 = a2);
        }
        return s2(e4, t4, r2);
      }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" };
    }(), n2.enc.Base64);
  });
  const c = "uni_id_token", u = "uni_id_token_expired", h = "uniIdToken", l = { DEFAULT: "FUNCTION", FUNCTION: "FUNCTION", OBJECT: "OBJECT", CLIENT_DB: "CLIENT_DB" }, d = "pending", p = "fulfilled", f = "rejected";
  function g(e2) {
    return Object.prototype.toString.call(e2).slice(8, -1).toLowerCase();
  }
  function m(e2) {
    return "object" === g(e2);
  }
  function y(e2) {
    return "function" == typeof e2;
  }
  function _(e2) {
    return function() {
      try {
        return e2.apply(e2, arguments);
      } catch (e3) {
        console.error(e3);
      }
    };
  }
  const w = "REJECTED", v = "NOT_PENDING";
  class I {
    constructor({ createPromise: e2, retryRule: t2 = w } = {}) {
      this.createPromise = e2, this.status = null, this.promise = null, this.retryRule = t2;
    }
    get needRetry() {
      if (!this.status)
        return true;
      switch (this.retryRule) {
        case w:
          return this.status === f;
        case v:
          return this.status !== d;
      }
    }
    exec() {
      return this.needRetry ? (this.status = d, this.promise = this.createPromise().then((e2) => (this.status = p, Promise.resolve(e2)), (e2) => (this.status = f, Promise.reject(e2))), this.promise) : this.promise;
    }
  }
  class S {
    constructor() {
      this._callback = {};
    }
    addListener(e2, t2) {
      this._callback[e2] || (this._callback[e2] = []), this._callback[e2].push(t2);
    }
    on(e2, t2) {
      return this.addListener(e2, t2);
    }
    removeListener(e2, t2) {
      if (!t2)
        throw new Error('The "listener" argument must be of type function. Received undefined');
      const n2 = this._callback[e2];
      if (!n2)
        return;
      const s2 = function(e3, t3) {
        for (let n3 = e3.length - 1; n3 >= 0; n3--)
          if (e3[n3] === t3)
            return n3;
        return -1;
      }(n2, t2);
      n2.splice(s2, 1);
    }
    off(e2, t2) {
      return this.removeListener(e2, t2);
    }
    removeAllListener(e2) {
      delete this._callback[e2];
    }
    emit(e2, ...t2) {
      const n2 = this._callback[e2];
      if (n2)
        for (let e3 = 0; e3 < n2.length; e3++)
          n2[e3](...t2);
    }
  }
  function T(e2) {
    return e2 && "string" == typeof e2 ? JSON.parse(e2) : e2;
  }
  const b = true, E = "app", P = T(define_process_env_UNI_SECURE_NETWORK_CONFIG_default), C = E, A = T(""), O = T("[]") || [];
  let N = "";
  try {
    N = "";
  } catch (e2) {
  }
  let R, L = {};
  function U(e2, t2 = {}) {
    var n2, s2;
    return n2 = L, s2 = e2, Object.prototype.hasOwnProperty.call(n2, s2) || (L[e2] = t2), L[e2];
  }
  function D() {
    return R || (R = function() {
      if ("undefined" != typeof globalThis)
        return globalThis;
      if ("undefined" != typeof self)
        return self;
      if ("undefined" != typeof window)
        return window;
      function e2() {
        return this;
      }
      return void 0 !== e2() ? e2() : new Function("return this")();
    }(), R);
  }
  L = uni._globalUniCloudObj ? uni._globalUniCloudObj : uni._globalUniCloudObj = {};
  const M = ["invoke", "success", "fail", "complete"], q = U("_globalUniCloudInterceptor");
  function F(e2, t2) {
    q[e2] || (q[e2] = {}), m(t2) && Object.keys(t2).forEach((n2) => {
      M.indexOf(n2) > -1 && function(e3, t3, n3) {
        let s2 = q[e3][t3];
        s2 || (s2 = q[e3][t3] = []), -1 === s2.indexOf(n3) && y(n3) && s2.push(n3);
      }(e2, n2, t2[n2]);
    });
  }
  function K(e2, t2) {
    q[e2] || (q[e2] = {}), m(t2) ? Object.keys(t2).forEach((n2) => {
      M.indexOf(n2) > -1 && function(e3, t3, n3) {
        const s2 = q[e3][t3];
        if (!s2)
          return;
        const r2 = s2.indexOf(n3);
        r2 > -1 && s2.splice(r2, 1);
      }(e2, n2, t2[n2]);
    }) : delete q[e2];
  }
  function j(e2, t2) {
    return e2 && 0 !== e2.length ? e2.reduce((e3, n2) => e3.then(() => n2(t2)), Promise.resolve()) : Promise.resolve();
  }
  function $(e2, t2) {
    return q[e2] && q[e2][t2] || [];
  }
  function B(e2) {
    F("callObject", e2);
  }
  const W = U("_globalUniCloudListener"), H = { RESPONSE: "response", NEED_LOGIN: "needLogin", REFRESH_TOKEN: "refreshToken" }, J = { CLIENT_DB: "clientdb", CLOUD_FUNCTION: "cloudfunction", CLOUD_OBJECT: "cloudobject" };
  function z(e2) {
    return W[e2] || (W[e2] = []), W[e2];
  }
  function V(e2, t2) {
    const n2 = z(e2);
    n2.includes(t2) || n2.push(t2);
  }
  function G(e2, t2) {
    const n2 = z(e2), s2 = n2.indexOf(t2);
    -1 !== s2 && n2.splice(s2, 1);
  }
  function Y(e2, t2) {
    const n2 = z(e2);
    for (let e3 = 0; e3 < n2.length; e3++) {
      (0, n2[e3])(t2);
    }
  }
  let Q, X = false;
  function Z() {
    return Q || (Q = new Promise((e2) => {
      X && e2(), function t2() {
        if ("function" == typeof getCurrentPages) {
          const t3 = getCurrentPages();
          t3 && t3[0] && (X = true, e2());
        }
        X || setTimeout(() => {
          t2();
        }, 30);
      }();
    }), Q);
  }
  function ee(e2) {
    const t2 = {};
    for (const n2 in e2) {
      const s2 = e2[n2];
      y(s2) && (t2[n2] = _(s2));
    }
    return t2;
  }
  class te extends Error {
    constructor(e2) {
      super(e2.message), this.errMsg = e2.message || e2.errMsg || "unknown system error", this.code = this.errCode = e2.code || e2.errCode || "SYSTEM_ERROR", this.errSubject = this.subject = e2.subject || e2.errSubject, this.cause = e2.cause, this.requestId = e2.requestId;
    }
    toJson(e2 = 0) {
      if (!(e2 >= 10))
        return e2++, { errCode: this.errCode, errMsg: this.errMsg, errSubject: this.errSubject, cause: this.cause && this.cause.toJson ? this.cause.toJson(e2) : this.cause };
    }
  }
  var ne = { request: (e2) => uni.request(e2), uploadFile: (e2) => uni.uploadFile(e2), setStorageSync: (e2, t2) => uni.setStorageSync(e2, t2), getStorageSync: (e2) => uni.getStorageSync(e2), removeStorageSync: (e2) => uni.removeStorageSync(e2), clearStorageSync: () => uni.clearStorageSync(), connectSocket: (e2) => uni.connectSocket(e2) };
  function se(e2) {
    return e2 && se(e2.__v_raw) || e2;
  }
  function re() {
    return { token: ne.getStorageSync(c) || ne.getStorageSync(h), tokenExpired: ne.getStorageSync(u) };
  }
  function ie({ token: e2, tokenExpired: t2 } = {}) {
    e2 && ne.setStorageSync(c, e2), t2 && ne.setStorageSync(u, t2);
  }
  let oe, ae;
  function ce() {
    return oe || (oe = uni.getSystemInfoSync()), oe;
  }
  function ue() {
    let e2, t2;
    try {
      if (uni.getLaunchOptionsSync) {
        if (uni.getLaunchOptionsSync.toString().indexOf("not yet implemented") > -1)
          return;
        const { scene: n2, channel: s2 } = uni.getLaunchOptionsSync();
        e2 = s2, t2 = n2;
      }
    } catch (e3) {
    }
    return { channel: e2, scene: t2 };
  }
  let he = {};
  function le() {
    const e2 = uni.getLocale && uni.getLocale() || "en";
    if (ae)
      return { ...he, ...ae, locale: e2, LOCALE: e2 };
    const t2 = ce(), { deviceId: n2, osName: s2, uniPlatform: r2, appId: i2 } = t2, o2 = ["appId", "appLanguage", "appName", "appVersion", "appVersionCode", "appWgtVersion", "browserName", "browserVersion", "deviceBrand", "deviceId", "deviceModel", "deviceType", "osName", "osVersion", "romName", "romVersion", "ua", "hostName", "hostVersion", "uniPlatform", "uniRuntimeVersion", "uniRuntimeVersionCode", "uniCompilerVersion", "uniCompilerVersionCode"];
    for (const e3 in t2)
      Object.hasOwnProperty.call(t2, e3) && -1 === o2.indexOf(e3) && delete t2[e3];
    return ae = { PLATFORM: r2, OS: s2, APPID: i2, DEVICEID: n2, ...ue(), ...t2 }, { ...he, ...ae, locale: e2, LOCALE: e2 };
  }
  var de = { sign: function(e2, t2) {
    let n2 = "";
    return Object.keys(e2).sort().forEach(function(t3) {
      e2[t3] && (n2 = n2 + "&" + t3 + "=" + e2[t3]);
    }), n2 = n2.slice(1), i(n2, t2).toString();
  }, wrappedRequest: function(e2, t2) {
    return new Promise((n2, s2) => {
      t2(Object.assign(e2, { complete(e3) {
        e3 || (e3 = {});
        const t3 = e3.data && e3.data.header && e3.data.header["x-serverless-request-id"] || e3.header && e3.header["request-id"];
        if (!e3.statusCode || e3.statusCode >= 400) {
          const n3 = e3.data && e3.data.error && e3.data.error.code || "SYS_ERR", r3 = e3.data && e3.data.error && e3.data.error.message || e3.errMsg || "request:fail";
          return s2(new te({ code: n3, message: r3, requestId: t3 }));
        }
        const r2 = e3.data;
        if (r2.error)
          return s2(new te({ code: r2.error.code, message: r2.error.message, requestId: t3 }));
        r2.result = r2.data, r2.requestId = t3, delete r2.data, n2(r2);
      } }));
    });
  }, toBase64: function(e2) {
    return a.stringify(o.parse(e2));
  } };
  var pe = class {
    constructor(e2) {
      ["spaceId", "clientSecret"].forEach((t2) => {
        if (!Object.prototype.hasOwnProperty.call(e2, t2))
          throw new Error(`${t2} required`);
      }), this.config = Object.assign({}, { endpoint: 0 === e2.spaceId.indexOf("mp-") ? "https://api.next.bspapp.com" : "https://api.bspapp.com" }, e2), this.config.provider = "aliyun", this.config.requestUrl = this.config.endpoint + "/client", this.config.envType = this.config.envType || "public", this.config.accessTokenKey = "access_token_" + this.config.spaceId, this.adapter = ne, this._getAccessTokenPromiseHub = new I({ createPromise: () => this.requestAuth(this.setupRequest({ method: "serverless.auth.user.anonymousAuthorize", params: "{}" }, "auth")).then((e3) => {
        if (!e3.result || !e3.result.accessToken)
          throw new te({ code: "AUTH_FAILED", message: "获取accessToken失败" });
        this.setAccessToken(e3.result.accessToken);
      }), retryRule: v });
    }
    get hasAccessToken() {
      return !!this.accessToken;
    }
    setAccessToken(e2) {
      this.accessToken = e2;
    }
    requestWrapped(e2) {
      return de.wrappedRequest(e2, this.adapter.request);
    }
    requestAuth(e2) {
      return this.requestWrapped(e2);
    }
    request(e2, t2) {
      return Promise.resolve().then(() => this.hasAccessToken ? t2 ? this.requestWrapped(e2) : this.requestWrapped(e2).catch((t3) => new Promise((e3, n2) => {
        !t3 || "GATEWAY_INVALID_TOKEN" !== t3.code && "InvalidParameter.InvalidToken" !== t3.code ? n2(t3) : e3();
      }).then(() => this.getAccessToken()).then(() => {
        const t4 = this.rebuildRequest(e2);
        return this.request(t4, true);
      })) : this.getAccessToken().then(() => {
        const t3 = this.rebuildRequest(e2);
        return this.request(t3, true);
      }));
    }
    rebuildRequest(e2) {
      const t2 = Object.assign({}, e2);
      return t2.data.token = this.accessToken, t2.header["x-basement-token"] = this.accessToken, t2.header["x-serverless-sign"] = de.sign(t2.data, this.config.clientSecret), t2;
    }
    setupRequest(e2, t2) {
      const n2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now() }), s2 = { "Content-Type": "application/json" };
      return "auth" !== t2 && (n2.token = this.accessToken, s2["x-basement-token"] = this.accessToken), s2["x-serverless-sign"] = de.sign(n2, this.config.clientSecret), { url: this.config.requestUrl, method: "POST", data: n2, dataType: "json", header: s2 };
    }
    getAccessToken() {
      return this._getAccessTokenPromiseHub.exec();
    }
    async authorize() {
      await this.getAccessToken();
    }
    callFunction(e2) {
      const t2 = { method: "serverless.function.runtime.invoke", params: JSON.stringify({ functionTarget: e2.name, functionArgs: e2.data || {} }) };
      return this.request({ ...this.setupRequest(t2), timeout: e2.timeout });
    }
    getOSSUploadOptionsFromPath(e2) {
      const t2 = { method: "serverless.file.resource.generateProximalSign", params: JSON.stringify(e2) };
      return this.request(this.setupRequest(t2));
    }
    uploadFileToOSS({ url: e2, formData: t2, name: n2, filePath: s2, fileType: r2, onUploadProgress: i2 }) {
      return new Promise((o2, a2) => {
        const c2 = this.adapter.uploadFile({ url: e2, formData: t2, name: n2, filePath: s2, fileType: r2, header: { "X-OSS-server-side-encrpytion": "AES256" }, success(e3) {
          e3 && e3.statusCode < 400 ? o2(e3) : a2(new te({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
        }, fail(e3) {
          a2(new te({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "文件上传失败" }));
        } });
        "function" == typeof i2 && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((e3) => {
          i2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
        });
      });
    }
    reportOSSUpload(e2) {
      const t2 = { method: "serverless.file.resource.report", params: JSON.stringify(e2) };
      return this.request(this.setupRequest(t2));
    }
    async uploadFile({ filePath: e2, cloudPath: t2, fileType: n2 = "image", cloudPathAsRealPath: s2 = false, onUploadProgress: r2, config: i2 }) {
      if ("string" !== g(t2))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath必须为字符串类型" });
      if (!(t2 = t2.trim()))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath不可为空" });
      if (/:\/\//.test(t2))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath不合法" });
      const o2 = i2 && i2.envType || this.config.envType;
      if (s2 && ("/" !== t2[0] && (t2 = "/" + t2), t2.indexOf("\\") > -1))
        throw new te({ code: "INVALID_PARAM", message: "使用cloudPath作为路径时，cloudPath不可包含“\\”" });
      const a2 = (await this.getOSSUploadOptionsFromPath({ env: o2, filename: s2 ? t2.split("/").pop() : t2, fileId: s2 ? t2 : void 0 })).result, c2 = "https://" + a2.cdnDomain + "/" + a2.ossPath, { securityToken: u2, accessKeyId: h2, signature: l2, host: d2, ossPath: p2, id: f2, policy: m2, ossCallbackUrl: y2 } = a2, _2 = { "Cache-Control": "max-age=2592000", "Content-Disposition": "attachment", OSSAccessKeyId: h2, Signature: l2, host: d2, id: f2, key: p2, policy: m2, success_action_status: 200 };
      if (u2 && (_2["x-oss-security-token"] = u2), y2) {
        const e3 = JSON.stringify({ callbackUrl: y2, callbackBody: JSON.stringify({ fileId: f2, spaceId: this.config.spaceId }), callbackBodyType: "application/json" });
        _2.callback = de.toBase64(e3);
      }
      const w2 = { url: "https://" + a2.host, formData: _2, fileName: "file", name: "file", filePath: e2, fileType: n2 };
      if (await this.uploadFileToOSS(Object.assign({}, w2, { onUploadProgress: r2 })), y2)
        return { success: true, filePath: e2, fileID: c2 };
      if ((await this.reportOSSUpload({ id: f2 })).success)
        return { success: true, filePath: e2, fileID: c2 };
      throw new te({ code: "UPLOAD_FAILED", message: "文件上传失败" });
    }
    getTempFileURL({ fileList: e2 } = {}) {
      return new Promise((t2, n2) => {
        Array.isArray(e2) && 0 !== e2.length || n2(new te({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" })), t2({ fileList: e2.map((e3) => ({ fileID: e3, tempFileURL: e3 })) });
      });
    }
    async getFileInfo({ fileList: e2 } = {}) {
      if (!Array.isArray(e2) || 0 === e2.length)
        throw new te({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" });
      const t2 = { method: "serverless.file.resource.info", params: JSON.stringify({ id: e2.map((e3) => e3.split("?")[0]).join(",") }) };
      return { fileList: (await this.request(this.setupRequest(t2))).result };
    }
  };
  var fe = { init(e2) {
    const t2 = new pe(e2), n2 = { signInAnonymously: function() {
      return t2.authorize();
    }, getLoginState: function() {
      return Promise.resolve(false);
    } };
    return t2.auth = function() {
      return n2;
    }, t2.customAuth = t2.auth, t2;
  } };
  const ge = "undefined" != typeof location && "http:" === location.protocol ? "http:" : "https:";
  var me;
  !function(e2) {
    e2.local = "local", e2.none = "none", e2.session = "session";
  }(me || (me = {}));
  var ye = function() {
  }, _e = n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = r, function(e3) {
      var t3 = n2, s2 = t3.lib, r2 = s2.WordArray, i2 = s2.Hasher, o2 = t3.algo, a2 = [], c2 = [];
      !function() {
        function t4(t5) {
          for (var n4 = e3.sqrt(t5), s4 = 2; s4 <= n4; s4++)
            if (!(t5 % s4))
              return false;
          return true;
        }
        function n3(e4) {
          return 4294967296 * (e4 - (0 | e4)) | 0;
        }
        for (var s3 = 2, r3 = 0; r3 < 64; )
          t4(s3) && (r3 < 8 && (a2[r3] = n3(e3.pow(s3, 0.5))), c2[r3] = n3(e3.pow(s3, 1 / 3)), r3++), s3++;
      }();
      var u2 = [], h2 = o2.SHA256 = i2.extend({ _doReset: function() {
        this._hash = new r2.init(a2.slice(0));
      }, _doProcessBlock: function(e4, t4) {
        for (var n3 = this._hash.words, s3 = n3[0], r3 = n3[1], i3 = n3[2], o3 = n3[3], a3 = n3[4], h3 = n3[5], l2 = n3[6], d2 = n3[7], p2 = 0; p2 < 64; p2++) {
          if (p2 < 16)
            u2[p2] = 0 | e4[t4 + p2];
          else {
            var f2 = u2[p2 - 15], g2 = (f2 << 25 | f2 >>> 7) ^ (f2 << 14 | f2 >>> 18) ^ f2 >>> 3, m2 = u2[p2 - 2], y2 = (m2 << 15 | m2 >>> 17) ^ (m2 << 13 | m2 >>> 19) ^ m2 >>> 10;
            u2[p2] = g2 + u2[p2 - 7] + y2 + u2[p2 - 16];
          }
          var _2 = s3 & r3 ^ s3 & i3 ^ r3 & i3, w2 = (s3 << 30 | s3 >>> 2) ^ (s3 << 19 | s3 >>> 13) ^ (s3 << 10 | s3 >>> 22), v2 = d2 + ((a3 << 26 | a3 >>> 6) ^ (a3 << 21 | a3 >>> 11) ^ (a3 << 7 | a3 >>> 25)) + (a3 & h3 ^ ~a3 & l2) + c2[p2] + u2[p2];
          d2 = l2, l2 = h3, h3 = a3, a3 = o3 + v2 | 0, o3 = i3, i3 = r3, r3 = s3, s3 = v2 + (w2 + _2) | 0;
        }
        n3[0] = n3[0] + s3 | 0, n3[1] = n3[1] + r3 | 0, n3[2] = n3[2] + i3 | 0, n3[3] = n3[3] + o3 | 0, n3[4] = n3[4] + a3 | 0, n3[5] = n3[5] + h3 | 0, n3[6] = n3[6] + l2 | 0, n3[7] = n3[7] + d2 | 0;
      }, _doFinalize: function() {
        var t4 = this._data, n3 = t4.words, s3 = 8 * this._nDataBytes, r3 = 8 * t4.sigBytes;
        return n3[r3 >>> 5] |= 128 << 24 - r3 % 32, n3[14 + (r3 + 64 >>> 9 << 4)] = e3.floor(s3 / 4294967296), n3[15 + (r3 + 64 >>> 9 << 4)] = s3, t4.sigBytes = 4 * n3.length, this._process(), this._hash;
      }, clone: function() {
        var e4 = i2.clone.call(this);
        return e4._hash = this._hash.clone(), e4;
      } });
      t3.SHA256 = i2._createHelper(h2), t3.HmacSHA256 = i2._createHmacHelper(h2);
    }(Math), n2.SHA256);
  }), we = _e, ve = n(function(e2, t2) {
    e2.exports = r.HmacSHA256;
  });
  const Ie = () => {
    let e2;
    if (!Promise) {
      e2 = () => {
      }, e2.promise = {};
      const t3 = () => {
        throw new te({ message: 'Your Node runtime does support ES6 Promises. Set "global.Promise" to your preferred implementation of promises.' });
      };
      return Object.defineProperty(e2.promise, "then", { get: t3 }), Object.defineProperty(e2.promise, "catch", { get: t3 }), e2;
    }
    const t2 = new Promise((t3, n2) => {
      e2 = (e3, s2) => e3 ? n2(e3) : t3(s2);
    });
    return e2.promise = t2, e2;
  };
  function Se(e2) {
    return void 0 === e2;
  }
  function Te(e2) {
    return "[object Null]" === Object.prototype.toString.call(e2);
  }
  function be(e2 = "") {
    return e2.replace(/([\s\S]+)\s+(请前往云开发AI小助手查看问题：.*)/, "$1");
  }
  function Ee(e2 = 32) {
    const t2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let n2 = "";
    for (let s2 = 0; s2 < e2; s2++)
      n2 += t2.charAt(Math.floor(62 * Math.random()));
    return n2;
  }
  var ke;
  function Pe(e2) {
    const t2 = (n2 = e2, "[object Array]" === Object.prototype.toString.call(n2) ? e2 : [e2]);
    var n2;
    for (const e3 of t2) {
      const { isMatch: t3, genAdapter: n3, runtime: s2 } = e3;
      if (t3())
        return { adapter: n3(), runtime: s2 };
    }
  }
  !function(e2) {
    e2.WEB = "web", e2.WX_MP = "wx_mp";
  }(ke || (ke = {}));
  const Ce = { adapter: null, runtime: void 0 }, Ae = ["anonymousUuidKey"];
  class Oe extends ye {
    constructor() {
      super(), Ce.adapter.root.tcbObject || (Ce.adapter.root.tcbObject = {});
    }
    setItem(e2, t2) {
      Ce.adapter.root.tcbObject[e2] = t2;
    }
    getItem(e2) {
      return Ce.adapter.root.tcbObject[e2];
    }
    removeItem(e2) {
      delete Ce.adapter.root.tcbObject[e2];
    }
    clear() {
      delete Ce.adapter.root.tcbObject;
    }
  }
  function xe(e2, t2) {
    switch (e2) {
      case "local":
        return t2.localStorage || new Oe();
      case "none":
        return new Oe();
      default:
        return t2.sessionStorage || new Oe();
    }
  }
  class Ne {
    constructor(e2) {
      if (!this._storage) {
        this._persistence = Ce.adapter.primaryStorage || e2.persistence, this._storage = xe(this._persistence, Ce.adapter);
        const t2 = `access_token_${e2.env}`, n2 = `access_token_expire_${e2.env}`, s2 = `refresh_token_${e2.env}`, r2 = `anonymous_uuid_${e2.env}`, i2 = `login_type_${e2.env}`, o2 = "device_id", a2 = `token_type_${e2.env}`, c2 = `user_info_${e2.env}`;
        this.keys = { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2, anonymousUuidKey: r2, loginTypeKey: i2, userInfoKey: c2, deviceIdKey: o2, tokenTypeKey: a2 };
      }
    }
    updatePersistence(e2) {
      if (e2 === this._persistence)
        return;
      const t2 = "local" === this._persistence;
      this._persistence = e2;
      const n2 = xe(e2, Ce.adapter);
      for (const e3 in this.keys) {
        const s2 = this.keys[e3];
        if (t2 && Ae.includes(e3))
          continue;
        const r2 = this._storage.getItem(s2);
        Se(r2) || Te(r2) || (n2.setItem(s2, r2), this._storage.removeItem(s2));
      }
      this._storage = n2;
    }
    setStore(e2, t2, n2) {
      if (!this._storage)
        return;
      const s2 = { version: n2 || "localCachev1", content: t2 }, r2 = JSON.stringify(s2);
      try {
        this._storage.setItem(e2, r2);
      } catch (e3) {
        throw e3;
      }
    }
    getStore(e2, t2) {
      try {
        if (!this._storage)
          return;
      } catch (e3) {
        return "";
      }
      t2 = t2 || "localCachev1";
      const n2 = this._storage.getItem(e2);
      if (!n2)
        return "";
      if (n2.indexOf(t2) >= 0) {
        return JSON.parse(n2).content;
      }
      return "";
    }
    removeStore(e2) {
      this._storage.removeItem(e2);
    }
  }
  const Re = {}, Le = {};
  function Ue(e2) {
    return Re[e2];
  }
  class De {
    constructor(e2, t2) {
      this.data = t2 || null, this.name = e2;
    }
  }
  class Me extends De {
    constructor(e2, t2) {
      super("error", { error: e2, data: t2 }), this.error = e2;
    }
  }
  const qe = new class {
    constructor() {
      this._listeners = {};
    }
    on(e2, t2) {
      return function(e3, t3, n2) {
        n2[e3] = n2[e3] || [], n2[e3].push(t3);
      }(e2, t2, this._listeners), this;
    }
    off(e2, t2) {
      return function(e3, t3, n2) {
        if (n2 && n2[e3]) {
          const s2 = n2[e3].indexOf(t3);
          -1 !== s2 && n2[e3].splice(s2, 1);
        }
      }(e2, t2, this._listeners), this;
    }
    fire(e2, t2) {
      if (e2 instanceof Me)
        return console.error(e2.error), this;
      const n2 = "string" == typeof e2 ? new De(e2, t2 || {}) : e2;
      const s2 = n2.name;
      if (this._listens(s2)) {
        n2.target = this;
        const e3 = this._listeners[s2] ? [...this._listeners[s2]] : [];
        for (const t3 of e3)
          t3.call(this, n2);
      }
      return this;
    }
    _listens(e2) {
      return this._listeners[e2] && this._listeners[e2].length > 0;
    }
  }();
  function Fe(e2, t2) {
    qe.on(e2, t2);
  }
  function Ke(e2, t2 = {}) {
    qe.fire(e2, t2);
  }
  function je(e2, t2) {
    qe.off(e2, t2);
  }
  const $e = "loginStateChanged", Be = "loginStateExpire", We = "loginTypeChanged", He = "anonymousConverted", Je = "refreshAccessToken";
  var ze;
  !function(e2) {
    e2.ANONYMOUS = "ANONYMOUS", e2.WECHAT = "WECHAT", e2.WECHAT_PUBLIC = "WECHAT-PUBLIC", e2.WECHAT_OPEN = "WECHAT-OPEN", e2.CUSTOM = "CUSTOM", e2.EMAIL = "EMAIL", e2.USERNAME = "USERNAME", e2.NULL = "NULL";
  }(ze || (ze = {}));
  class Ve {
    constructor() {
      this._fnPromiseMap = /* @__PURE__ */ new Map();
    }
    async run(e2, t2) {
      let n2 = this._fnPromiseMap.get(e2);
      return n2 || (n2 = new Promise(async (n3, s2) => {
        try {
          await this._runIdlePromise();
          const e3 = t2();
          n3(await e3);
        } catch (e3) {
          s2(e3);
        } finally {
          this._fnPromiseMap.delete(e2);
        }
      }), this._fnPromiseMap.set(e2, n2)), n2;
    }
    _runIdlePromise() {
      return Promise.resolve();
    }
  }
  class Ge {
    constructor(e2) {
      this._singlePromise = new Ve(), this._cache = Ue(e2.env), this._baseURL = `https://${e2.env}.ap-shanghai.tcb-api.tencentcloudapi.com`, this._reqClass = new Ce.adapter.reqClass({ timeout: e2.timeout, timeoutMsg: `请求在${e2.timeout / 1e3}s内未完成，已中断`, restrictedMethods: ["post"] });
    }
    _getDeviceId() {
      if (this._deviceID)
        return this._deviceID;
      const { deviceIdKey: e2 } = this._cache.keys;
      let t2 = this._cache.getStore(e2);
      return "string" == typeof t2 && t2.length >= 16 && t2.length <= 48 || (t2 = Ee(), this._cache.setStore(e2, t2)), this._deviceID = t2, t2;
    }
    async _request(e2, t2, n2 = {}) {
      const s2 = { "x-request-id": Ee(), "x-device-id": this._getDeviceId() };
      if (n2.withAccessToken) {
        const { tokenTypeKey: e3 } = this._cache.keys, t3 = await this.getAccessToken(), n3 = this._cache.getStore(e3);
        s2.authorization = `${n3} ${t3}`;
      }
      return this._reqClass["get" === n2.method ? "get" : "post"]({ url: `${this._baseURL}${e2}`, data: t2, headers: s2 });
    }
    async _fetchAccessToken() {
      const { loginTypeKey: e2, accessTokenKey: t2, accessTokenExpireKey: n2, tokenTypeKey: s2 } = this._cache.keys, r2 = this._cache.getStore(e2);
      if (r2 && r2 !== ze.ANONYMOUS)
        throw new te({ code: "INVALID_OPERATION", message: "非匿名登录不支持刷新 access token" });
      const i2 = await this._singlePromise.run("fetchAccessToken", async () => (await this._request("/auth/v1/signin/anonymously", {}, { method: "post" })).data), { access_token: o2, expires_in: a2, token_type: c2 } = i2;
      return this._cache.setStore(s2, c2), this._cache.setStore(t2, o2), this._cache.setStore(n2, Date.now() + 1e3 * a2), o2;
    }
    isAccessTokenExpired(e2, t2) {
      let n2 = true;
      return e2 && t2 && (n2 = t2 < Date.now()), n2;
    }
    async getAccessToken() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2), s2 = this._cache.getStore(t2);
      return this.isAccessTokenExpired(n2, s2) ? this._fetchAccessToken() : n2;
    }
    async refreshAccessToken() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2, loginTypeKey: n2 } = this._cache.keys;
      return this._cache.removeStore(e2), this._cache.removeStore(t2), this._cache.setStore(n2, ze.ANONYMOUS), this.getAccessToken();
    }
    async getUserInfo() {
      return this._singlePromise.run("getUserInfo", async () => (await this._request("/auth/v1/user/me", {}, { withAccessToken: true, method: "get" })).data);
    }
  }
  const Ye = ["auth.getJwt", "auth.logout", "auth.signInWithTicket", "auth.signInAnonymously", "auth.signIn", "auth.fetchAccessTokenWithRefreshToken", "auth.signUpWithEmailAndPassword", "auth.activateEndUserMail", "auth.sendPasswordResetEmail", "auth.resetPasswordWithToken", "auth.isUsernameRegistered"], Qe = { "X-SDK-Version": "1.3.5" };
  function Xe(e2, t2, n2) {
    const s2 = e2[t2];
    e2[t2] = function(t3) {
      const r2 = {}, i2 = {};
      n2.forEach((n3) => {
        const { data: s3, headers: o3 } = n3.call(e2, t3);
        Object.assign(r2, s3), Object.assign(i2, o3);
      });
      const o2 = t3.data;
      return o2 && (() => {
        var e3;
        if (e3 = o2, "[object FormData]" !== Object.prototype.toString.call(e3))
          t3.data = { ...o2, ...r2 };
        else
          for (const e4 in r2)
            o2.append(e4, r2[e4]);
      })(), t3.headers = { ...t3.headers || {}, ...i2 }, s2.call(e2, t3);
    };
  }
  function Ze() {
    const e2 = Math.random().toString(16).slice(2);
    return { data: { seqId: e2 }, headers: { ...Qe, "x-seqid": e2 } };
  }
  class et {
    constructor(e2 = {}) {
      var t2;
      this.config = e2, this._reqClass = new Ce.adapter.reqClass({ timeout: this.config.timeout, timeoutMsg: `请求在${this.config.timeout / 1e3}s内未完成，已中断`, restrictedMethods: ["post"] }), this._cache = Ue(this.config.env), this._localCache = (t2 = this.config.env, Le[t2]), this.oauth = new Ge(this.config), Xe(this._reqClass, "post", [Ze]), Xe(this._reqClass, "upload", [Ze]), Xe(this._reqClass, "download", [Ze]);
    }
    async post(e2) {
      return await this._reqClass.post(e2);
    }
    async upload(e2) {
      return await this._reqClass.upload(e2);
    }
    async download(e2) {
      return await this._reqClass.download(e2);
    }
    async refreshAccessToken() {
      let e2, t2;
      this._refreshAccessTokenPromise || (this._refreshAccessTokenPromise = this._refreshAccessToken());
      try {
        e2 = await this._refreshAccessTokenPromise;
      } catch (e3) {
        t2 = e3;
      }
      if (this._refreshAccessTokenPromise = null, this._shouldRefreshAccessTokenHook = null, t2)
        throw t2;
      return e2;
    }
    async _refreshAccessToken() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2, refreshTokenKey: n2, loginTypeKey: s2, anonymousUuidKey: r2 } = this._cache.keys;
      this._cache.removeStore(e2), this._cache.removeStore(t2);
      let i2 = this._cache.getStore(n2);
      if (!i2)
        throw new te({ message: "未登录CloudBase" });
      const o2 = { refresh_token: i2 }, a2 = await this.request("auth.fetchAccessTokenWithRefreshToken", o2);
      if (a2.data.code) {
        const { code: e3 } = a2.data;
        if ("SIGN_PARAM_INVALID" === e3 || "REFRESH_TOKEN_EXPIRED" === e3 || "INVALID_REFRESH_TOKEN" === e3) {
          if (this._cache.getStore(s2) === ze.ANONYMOUS && "INVALID_REFRESH_TOKEN" === e3) {
            const e4 = this._cache.getStore(r2), t3 = this._cache.getStore(n2), s3 = await this.send("auth.signInAnonymously", { anonymous_uuid: e4, refresh_token: t3 });
            return this.setRefreshToken(s3.refresh_token), this._refreshAccessToken();
          }
          Ke(Be), this._cache.removeStore(n2);
        }
        throw new te({ code: a2.data.code, message: `刷新access token失败：${a2.data.code}` });
      }
      if (a2.data.access_token)
        return Ke(Je), this._cache.setStore(e2, a2.data.access_token), this._cache.setStore(t2, a2.data.access_token_expire + Date.now()), { accessToken: a2.data.access_token, accessTokenExpire: a2.data.access_token_expire };
      a2.data.refresh_token && (this._cache.removeStore(n2), this._cache.setStore(n2, a2.data.refresh_token), this._refreshAccessToken());
    }
    async getAccessToken() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2, refreshTokenKey: n2 } = this._cache.keys;
      if (!this._cache.getStore(n2))
        throw new te({ message: "refresh token不存在，登录状态异常" });
      let s2 = this._cache.getStore(e2), r2 = this._cache.getStore(t2), i2 = true;
      return this._shouldRefreshAccessTokenHook && !await this._shouldRefreshAccessTokenHook(s2, r2) && (i2 = false), (!s2 || !r2 || r2 < Date.now()) && i2 ? this.refreshAccessToken() : { accessToken: s2, accessTokenExpire: r2 };
    }
    async request(e2, t2, n2) {
      const s2 = `x-tcb-trace_${this.config.env}`;
      let r2 = "application/x-www-form-urlencoded";
      const i2 = { action: e2, env: this.config.env, dataVersion: "2019-08-16", ...t2 };
      let o2;
      if (-1 === Ye.indexOf(e2) && (this._cache.keys, i2.access_token = await this.oauth.getAccessToken()), "storage.uploadFile" === e2) {
        o2 = new FormData();
        for (let e3 in o2)
          o2.hasOwnProperty(e3) && void 0 !== o2[e3] && o2.append(e3, i2[e3]);
        r2 = "multipart/form-data";
      } else {
        r2 = "application/json", o2 = {};
        for (let e3 in i2)
          void 0 !== i2[e3] && (o2[e3] = i2[e3]);
      }
      let a2 = { headers: { "content-type": r2 } };
      n2 && n2.timeout && (a2.timeout = n2.timeout), n2 && n2.onUploadProgress && (a2.onUploadProgress = n2.onUploadProgress);
      const c2 = this._localCache.getStore(s2);
      c2 && (a2.headers["X-TCB-Trace"] = c2);
      const { parse: u2, inQuery: h2, search: l2 } = t2;
      let d2 = { env: this.config.env };
      u2 && (d2.parse = true), h2 && (d2 = { ...h2, ...d2 });
      let p2 = function(e3, t3, n3 = {}) {
        const s3 = /\?/.test(t3);
        let r3 = "";
        for (let e4 in n3)
          "" === r3 ? !s3 && (t3 += "?") : r3 += "&", r3 += `${e4}=${encodeURIComponent(n3[e4])}`;
        return /^http(s)?\:\/\//.test(t3 += r3) ? t3 : `${e3}${t3}`;
      }(ge, "//tcb-api.tencentcloudapi.com/web", d2);
      l2 && (p2 += l2);
      const f2 = await this.post({ url: p2, data: o2, ...a2 }), g2 = f2.header && f2.header["x-tcb-trace"];
      if (g2 && this._localCache.setStore(s2, g2), 200 !== Number(f2.status) && 200 !== Number(f2.statusCode) || !f2.data)
        throw new te({ code: "NETWORK_ERROR", message: "network request error" });
      return f2;
    }
    async send(e2, t2 = {}, n2 = {}) {
      const s2 = await this.request(e2, t2, { ...n2, onUploadProgress: t2.onUploadProgress });
      if (("ACCESS_TOKEN_DISABLED" === s2.data.code || "ACCESS_TOKEN_EXPIRED" === s2.data.code) && -1 === Ye.indexOf(e2)) {
        await this.oauth.refreshAccessToken();
        const s3 = await this.request(e2, t2, { ...n2, onUploadProgress: t2.onUploadProgress });
        if (s3.data.code)
          throw new te({ code: s3.data.code, message: be(s3.data.message) });
        return s3.data;
      }
      if (s2.data.code)
        throw new te({ code: s2.data.code, message: be(s2.data.message) });
      return s2.data;
    }
    setRefreshToken(e2) {
      const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e2);
    }
  }
  const tt = {};
  function nt(e2) {
    return tt[e2];
  }
  class st {
    constructor(e2) {
      this.config = e2, this._cache = Ue(e2.env), this._request = nt(e2.env);
    }
    setRefreshToken(e2) {
      const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e2);
    }
    setAccessToken(e2, t2) {
      const { accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys;
      this._cache.setStore(n2, e2), this._cache.setStore(s2, t2);
    }
    async refreshUserInfo() {
      const { data: e2 } = await this._request.send("auth.getUserInfo", {});
      return this.setLocalUserInfo(e2), e2;
    }
    setLocalUserInfo(e2) {
      const { userInfoKey: t2 } = this._cache.keys;
      this._cache.setStore(t2, e2);
    }
  }
  class rt {
    constructor(e2) {
      if (!e2)
        throw new te({ code: "PARAM_ERROR", message: "envId is not defined" });
      this._envId = e2, this._cache = Ue(this._envId), this._request = nt(this._envId), this.setUserInfo();
    }
    linkWithTicket(e2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "ticket must be string" });
      return this._request.send("auth.linkWithTicket", { ticket: e2 });
    }
    linkWithRedirect(e2) {
      e2.signInWithRedirect();
    }
    updatePassword(e2, t2) {
      return this._request.send("auth.updatePassword", { oldPassword: t2, newPassword: e2 });
    }
    updateEmail(e2) {
      return this._request.send("auth.updateEmail", { newEmail: e2 });
    }
    updateUsername(e2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "username must be a string" });
      return this._request.send("auth.updateUsername", { username: e2 });
    }
    async getLinkedUidList() {
      const { data: e2 } = await this._request.send("auth.getLinkedUidList", {});
      let t2 = false;
      const { users: n2 } = e2;
      return n2.forEach((e3) => {
        e3.wxOpenId && e3.wxPublicId && (t2 = true);
      }), { users: n2, hasPrimaryUid: t2 };
    }
    setPrimaryUid(e2) {
      return this._request.send("auth.setPrimaryUid", { uid: e2 });
    }
    unlink(e2) {
      return this._request.send("auth.unlink", { platform: e2 });
    }
    async update(e2) {
      const { nickName: t2, gender: n2, avatarUrl: s2, province: r2, country: i2, city: o2 } = e2, { data: a2 } = await this._request.send("auth.updateUserInfo", { nickName: t2, gender: n2, avatarUrl: s2, province: r2, country: i2, city: o2 });
      this.setLocalUserInfo(a2);
    }
    async refresh() {
      const e2 = await this._request.oauth.getUserInfo();
      return this.setLocalUserInfo(e2), e2;
    }
    setUserInfo() {
      const { userInfoKey: e2 } = this._cache.keys, t2 = this._cache.getStore(e2);
      ["uid", "loginType", "openid", "wxOpenId", "wxPublicId", "unionId", "qqMiniOpenId", "email", "hasPassword", "customUserId", "nickName", "gender", "avatarUrl"].forEach((e3) => {
        this[e3] = t2[e3];
      }), this.location = { country: t2.country, province: t2.province, city: t2.city };
    }
    setLocalUserInfo(e2) {
      const { userInfoKey: t2 } = this._cache.keys;
      this._cache.setStore(t2, e2), this.setUserInfo();
    }
  }
  class it {
    constructor(e2) {
      if (!e2)
        throw new te({ code: "PARAM_ERROR", message: "envId is not defined" });
      this._cache = Ue(e2);
      const { refreshTokenKey: t2, accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys, r2 = this._cache.getStore(t2), i2 = this._cache.getStore(n2), o2 = this._cache.getStore(s2);
      this.credential = { refreshToken: r2, accessToken: i2, accessTokenExpire: o2 }, this.user = new rt(e2);
    }
    get isAnonymousAuth() {
      return this.loginType === ze.ANONYMOUS;
    }
    get isCustomAuth() {
      return this.loginType === ze.CUSTOM;
    }
    get isWeixinAuth() {
      return this.loginType === ze.WECHAT || this.loginType === ze.WECHAT_OPEN || this.loginType === ze.WECHAT_PUBLIC;
    }
    get loginType() {
      return this._cache.getStore(this._cache.keys.loginTypeKey);
    }
  }
  class ot extends st {
    async signIn() {
      this._cache.updatePersistence("local"), await this._request.oauth.getAccessToken(), Ke($e), Ke(We, { env: this.config.env, loginType: ze.ANONYMOUS, persistence: "local" });
      const e2 = new it(this.config.env);
      return await e2.user.refresh(), e2;
    }
    async linkAndRetrieveDataWithTicket(e2) {
      const { anonymousUuidKey: t2, refreshTokenKey: n2 } = this._cache.keys, s2 = this._cache.getStore(t2), r2 = this._cache.getStore(n2), i2 = await this._request.send("auth.linkAndRetrieveDataWithTicket", { anonymous_uuid: s2, refresh_token: r2, ticket: e2 });
      if (i2.refresh_token)
        return this._clearAnonymousUUID(), this.setRefreshToken(i2.refresh_token), await this._request.refreshAccessToken(), Ke(He, { env: this.config.env }), Ke(We, { loginType: ze.CUSTOM, persistence: "local" }), { credential: { refreshToken: i2.refresh_token } };
      throw new te({ message: "匿名转化失败" });
    }
    _setAnonymousUUID(e2) {
      const { anonymousUuidKey: t2, loginTypeKey: n2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.setStore(t2, e2), this._cache.setStore(n2, ze.ANONYMOUS);
    }
    _clearAnonymousUUID() {
      this._cache.removeStore(this._cache.keys.anonymousUuidKey);
    }
  }
  class at extends st {
    async signIn(e2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "ticket must be a string" });
      const { refreshTokenKey: t2 } = this._cache.keys, n2 = await this._request.send("auth.signInWithTicket", { ticket: e2, refresh_token: this._cache.getStore(t2) || "" });
      if (n2.refresh_token)
        return this.setRefreshToken(n2.refresh_token), await this._request.refreshAccessToken(), Ke($e), Ke(We, { env: this.config.env, loginType: ze.CUSTOM, persistence: this.config.persistence }), await this.refreshUserInfo(), new it(this.config.env);
      throw new te({ message: "自定义登录失败" });
    }
  }
  class ct extends st {
    async signIn(e2, t2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "email must be a string" });
      const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: "EMAIL", email: e2, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: r2, access_token: i2, access_token_expire: o2 } = s2;
      if (r2)
        return this.setRefreshToken(r2), i2 && o2 ? this.setAccessToken(i2, o2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), Ke($e), Ke(We, { env: this.config.env, loginType: ze.EMAIL, persistence: this.config.persistence }), new it(this.config.env);
      throw s2.code ? new te({ code: s2.code, message: `邮箱登录失败: ${s2.message}` }) : new te({ message: "邮箱登录失败" });
    }
    async activate(e2) {
      return this._request.send("auth.activateEndUserMail", { token: e2 });
    }
    async resetPasswordWithToken(e2, t2) {
      return this._request.send("auth.resetPasswordWithToken", { token: e2, newPassword: t2 });
    }
  }
  class ut extends st {
    async signIn(e2, t2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "username must be a string" });
      "string" != typeof t2 && (t2 = "", console.warn("password is empty"));
      const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: ze.USERNAME, username: e2, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: r2, access_token_expire: i2, access_token: o2 } = s2;
      if (r2)
        return this.setRefreshToken(r2), o2 && i2 ? this.setAccessToken(o2, i2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), Ke($e), Ke(We, { env: this.config.env, loginType: ze.USERNAME, persistence: this.config.persistence }), new it(this.config.env);
      throw s2.code ? new te({ code: s2.code, message: `用户名密码登录失败: ${s2.message}` }) : new te({ message: "用户名密码登录失败" });
    }
  }
  class ht {
    constructor(e2) {
      this.config = e2, this._cache = Ue(e2.env), this._request = nt(e2.env), this._onAnonymousConverted = this._onAnonymousConverted.bind(this), this._onLoginTypeChanged = this._onLoginTypeChanged.bind(this), Fe(We, this._onLoginTypeChanged);
    }
    get currentUser() {
      const e2 = this.hasLoginState();
      return e2 && e2.user || null;
    }
    get loginType() {
      return this._cache.getStore(this._cache.keys.loginTypeKey);
    }
    anonymousAuthProvider() {
      return new ot(this.config);
    }
    customAuthProvider() {
      return new at(this.config);
    }
    emailAuthProvider() {
      return new ct(this.config);
    }
    usernameAuthProvider() {
      return new ut(this.config);
    }
    async signInAnonymously() {
      return new ot(this.config).signIn();
    }
    async signInWithEmailAndPassword(e2, t2) {
      return new ct(this.config).signIn(e2, t2);
    }
    signInWithUsernameAndPassword(e2, t2) {
      return new ut(this.config).signIn(e2, t2);
    }
    async linkAndRetrieveDataWithTicket(e2) {
      this._anonymousAuthProvider || (this._anonymousAuthProvider = new ot(this.config)), Fe(He, this._onAnonymousConverted);
      return await this._anonymousAuthProvider.linkAndRetrieveDataWithTicket(e2);
    }
    async signOut() {
      if (this.loginType === ze.ANONYMOUS)
        throw new te({ message: "匿名用户不支持登出操作" });
      const { refreshTokenKey: e2, accessTokenKey: t2, accessTokenExpireKey: n2 } = this._cache.keys, s2 = this._cache.getStore(e2);
      if (!s2)
        return;
      const r2 = await this._request.send("auth.logout", { refresh_token: s2 });
      return this._cache.removeStore(e2), this._cache.removeStore(t2), this._cache.removeStore(n2), Ke($e), Ke(We, { env: this.config.env, loginType: ze.NULL, persistence: this.config.persistence }), r2;
    }
    async signUpWithEmailAndPassword(e2, t2) {
      return this._request.send("auth.signUpWithEmailAndPassword", { email: e2, password: t2 });
    }
    async sendPasswordResetEmail(e2) {
      return this._request.send("auth.sendPasswordResetEmail", { email: e2 });
    }
    onLoginStateChanged(e2) {
      Fe($e, () => {
        const t3 = this.hasLoginState();
        e2.call(this, t3);
      });
      const t2 = this.hasLoginState();
      e2.call(this, t2);
    }
    onLoginStateExpired(e2) {
      Fe(Be, e2.bind(this));
    }
    onAccessTokenRefreshed(e2) {
      Fe(Je, e2.bind(this));
    }
    onAnonymousConverted(e2) {
      Fe(He, e2.bind(this));
    }
    onLoginTypeChanged(e2) {
      Fe(We, () => {
        const t2 = this.hasLoginState();
        e2.call(this, t2);
      });
    }
    async getAccessToken() {
      return { accessToken: (await this._request.getAccessToken()).accessToken, env: this.config.env };
    }
    hasLoginState() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2), s2 = this._cache.getStore(t2);
      return this._request.oauth.isAccessTokenExpired(n2, s2) ? null : new it(this.config.env);
    }
    async isUsernameRegistered(e2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "username must be a string" });
      const { data: t2 } = await this._request.send("auth.isUsernameRegistered", { username: e2 });
      return t2 && t2.isRegistered;
    }
    getLoginState() {
      return Promise.resolve(this.hasLoginState());
    }
    async signInWithTicket(e2) {
      return new at(this.config).signIn(e2);
    }
    shouldRefreshAccessToken(e2) {
      this._request._shouldRefreshAccessTokenHook = e2.bind(this);
    }
    getUserInfo() {
      return this._request.send("auth.getUserInfo", {}).then((e2) => e2.code ? e2 : { ...e2.data, requestId: e2.seqId });
    }
    getAuthHeader() {
      const { refreshTokenKey: e2, accessTokenKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2);
      return { "x-cloudbase-credentials": this._cache.getStore(t2) + "/@@/" + n2 };
    }
    _onAnonymousConverted(e2) {
      const { env: t2 } = e2.data;
      t2 === this.config.env && this._cache.updatePersistence(this.config.persistence);
    }
    _onLoginTypeChanged(e2) {
      const { loginType: t2, persistence: n2, env: s2 } = e2.data;
      s2 === this.config.env && (this._cache.updatePersistence(n2), this._cache.setStore(this._cache.keys.loginTypeKey, t2));
    }
  }
  const lt = function(e2, t2) {
    t2 = t2 || Ie();
    const n2 = nt(this.config.env), { cloudPath: s2, filePath: r2, onUploadProgress: i2, fileType: o2 = "image" } = e2;
    return n2.send("storage.getUploadMetadata", { path: s2 }).then((e3) => {
      const { data: { url: a2, authorization: c2, token: u2, fileId: h2, cosFileId: l2 }, requestId: d2 } = e3, p2 = { key: s2, signature: c2, "x-cos-meta-fileid": l2, success_action_status: "201", "x-cos-security-token": u2 };
      n2.upload({ url: a2, data: p2, file: r2, name: s2, fileType: o2, onUploadProgress: i2 }).then((e4) => {
        201 === e4.statusCode ? t2(null, { fileID: h2, requestId: d2 }) : t2(new te({ code: "STORAGE_REQUEST_FAIL", message: `STORAGE_REQUEST_FAIL: ${e4.data}` }));
      }).catch((e4) => {
        t2(e4);
      });
    }).catch((e3) => {
      t2(e3);
    }), t2.promise;
  }, dt = function(e2, t2) {
    t2 = t2 || Ie();
    const n2 = nt(this.config.env), { cloudPath: s2 } = e2;
    return n2.send("storage.getUploadMetadata", { path: s2 }).then((e3) => {
      t2(null, e3);
    }).catch((e3) => {
      t2(e3);
    }), t2.promise;
  }, pt = function({ fileList: e2 }, t2) {
    if (t2 = t2 || Ie(), !e2 || !Array.isArray(e2))
      return { code: "INVALID_PARAM", message: "fileList必须是非空的数组" };
    for (let t3 of e2)
      if (!t3 || "string" != typeof t3)
        return { code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" };
    const n2 = { fileid_list: e2 };
    return nt(this.config.env).send("storage.batchDeleteFile", n2).then((e3) => {
      e3.code ? t2(null, e3) : t2(null, { fileList: e3.data.delete_list, requestId: e3.requestId });
    }).catch((e3) => {
      t2(e3);
    }), t2.promise;
  }, ft = function({ fileList: e2 }, t2) {
    t2 = t2 || Ie(), e2 && Array.isArray(e2) || t2(null, { code: "INVALID_PARAM", message: "fileList必须是非空的数组" });
    let n2 = [];
    for (let s3 of e2)
      "object" == typeof s3 ? (s3.hasOwnProperty("fileID") && s3.hasOwnProperty("maxAge") || t2(null, { code: "INVALID_PARAM", message: "fileList的元素必须是包含fileID和maxAge的对象" }), n2.push({ fileid: s3.fileID, max_age: s3.maxAge })) : "string" == typeof s3 ? n2.push({ fileid: s3 }) : t2(null, { code: "INVALID_PARAM", message: "fileList的元素必须是字符串" });
    const s2 = { file_list: n2 };
    return nt(this.config.env).send("storage.batchGetDownloadUrl", s2).then((e3) => {
      e3.code ? t2(null, e3) : t2(null, { fileList: e3.data.download_list, requestId: e3.requestId });
    }).catch((e3) => {
      t2(e3);
    }), t2.promise;
  }, gt = async function({ fileID: e2 }, t2) {
    const n2 = (await ft.call(this, { fileList: [{ fileID: e2, maxAge: 600 }] })).fileList[0];
    if ("SUCCESS" !== n2.code)
      return t2 ? t2(n2) : new Promise((e3) => {
        e3(n2);
      });
    const s2 = nt(this.config.env);
    let r2 = n2.download_url;
    if (r2 = encodeURI(r2), !t2)
      return s2.download({ url: r2 });
    t2(await s2.download({ url: r2 }));
  }, mt = function({ name: e2, data: t2, query: n2, parse: s2, search: r2, timeout: i2 }, o2) {
    const a2 = o2 || Ie();
    let c2;
    try {
      c2 = t2 ? JSON.stringify(t2) : "";
    } catch (e3) {
      return Promise.reject(e3);
    }
    if (!e2)
      return Promise.reject(new te({ code: "PARAM_ERROR", message: "函数名不能为空" }));
    const u2 = { inQuery: n2, parse: s2, search: r2, function_name: e2, request_data: c2 };
    return nt(this.config.env).send("functions.invokeFunction", u2, { timeout: i2 }).then((e3) => {
      if (e3.code)
        a2(null, e3);
      else {
        let t3 = e3.data.response_data;
        if (s2)
          a2(null, { result: t3, requestId: e3.requestId });
        else
          try {
            t3 = JSON.parse(e3.data.response_data), a2(null, { result: t3, requestId: e3.requestId });
          } catch (e4) {
            a2(new te({ message: "response data must be json" }));
          }
      }
      return a2.promise;
    }).catch((e3) => {
      a2(e3);
    }), a2.promise;
  }, yt = { timeout: 15e3, persistence: "session" }, _t = 6e5, wt = {};
  class vt {
    constructor(e2) {
      this.config = e2 || this.config, this.authObj = void 0;
    }
    init(e2) {
      switch (Ce.adapter || (this.requestClient = new Ce.adapter.reqClass({ timeout: e2.timeout || 5e3, timeoutMsg: `请求在${(e2.timeout || 5e3) / 1e3}s内未完成，已中断` })), this.config = { ...yt, ...e2 }, true) {
        case this.config.timeout > _t:
          console.warn("timeout大于可配置上限[10分钟]，已重置为上限数值"), this.config.timeout = _t;
          break;
        case this.config.timeout < 100:
          console.warn("timeout小于可配置下限[100ms]，已重置为下限数值"), this.config.timeout = 100;
      }
      return new vt(this.config);
    }
    auth({ persistence: e2 } = {}) {
      if (this.authObj)
        return this.authObj;
      const t2 = e2 || Ce.adapter.primaryStorage || yt.persistence;
      var n2;
      return t2 !== this.config.persistence && (this.config.persistence = t2), function(e3) {
        const { env: t3 } = e3;
        Re[t3] = new Ne(e3), Le[t3] = new Ne({ ...e3, persistence: "local" });
      }(this.config), n2 = this.config, tt[n2.env] = new et(n2), this.authObj = new ht(this.config), this.authObj;
    }
    on(e2, t2) {
      return Fe.apply(this, [e2, t2]);
    }
    off(e2, t2) {
      return je.apply(this, [e2, t2]);
    }
    callFunction(e2, t2) {
      return mt.apply(this, [e2, t2]);
    }
    deleteFile(e2, t2) {
      return pt.apply(this, [e2, t2]);
    }
    getTempFileURL(e2, t2) {
      return ft.apply(this, [e2, t2]);
    }
    downloadFile(e2, t2) {
      return gt.apply(this, [e2, t2]);
    }
    uploadFile(e2, t2) {
      return lt.apply(this, [e2, t2]);
    }
    getUploadMetadata(e2, t2) {
      return dt.apply(this, [e2, t2]);
    }
    registerExtension(e2) {
      wt[e2.name] = e2;
    }
    async invokeExtension(e2, t2) {
      const n2 = wt[e2];
      if (!n2)
        throw new te({ message: `扩展${e2} 必须先注册` });
      return await n2.invoke(t2, this);
    }
    useAdapters(e2) {
      const { adapter: t2, runtime: n2 } = Pe(e2) || {};
      t2 && (Ce.adapter = t2), n2 && (Ce.runtime = n2);
    }
  }
  var It = new vt();
  function St(e2, t2, n2) {
    void 0 === n2 && (n2 = {});
    var s2 = /\?/.test(t2), r2 = "";
    for (var i2 in n2)
      "" === r2 ? !s2 && (t2 += "?") : r2 += "&", r2 += i2 + "=" + encodeURIComponent(n2[i2]);
    return /^http(s)?:\/\//.test(t2 += r2) ? t2 : "" + e2 + t2;
  }
  class Tt {
    get(e2) {
      const { url: t2, data: n2, headers: s2, timeout: r2 } = e2;
      return new Promise((e3, i2) => {
        ne.request({ url: St("https:", t2), data: n2, method: "GET", header: s2, timeout: r2, success(t3) {
          e3(t3);
        }, fail(e4) {
          i2(e4);
        } });
      });
    }
    post(e2) {
      const { url: t2, data: n2, headers: s2, timeout: r2 } = e2;
      return new Promise((e3, i2) => {
        ne.request({ url: St("https:", t2), data: n2, method: "POST", header: s2, timeout: r2, success(t3) {
          e3(t3);
        }, fail(e4) {
          i2(e4);
        } });
      });
    }
    upload(e2) {
      return new Promise((t2, n2) => {
        const { url: s2, file: r2, data: i2, headers: o2, fileType: a2 } = e2, c2 = ne.uploadFile({ url: St("https:", s2), name: "file", formData: Object.assign({}, i2), filePath: r2, fileType: a2, header: o2, success(e3) {
          const n3 = { statusCode: e3.statusCode, data: e3.data || {} };
          200 === e3.statusCode && i2.success_action_status && (n3.statusCode = parseInt(i2.success_action_status, 10)), t2(n3);
        }, fail(e3) {
          n2(new Error(e3.errMsg || "uploadFile:fail"));
        } });
        "function" == typeof e2.onUploadProgress && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((t3) => {
          e2.onUploadProgress({ loaded: t3.totalBytesSent, total: t3.totalBytesExpectedToSend });
        });
      });
    }
  }
  const bt = { setItem(e2, t2) {
    ne.setStorageSync(e2, t2);
  }, getItem: (e2) => ne.getStorageSync(e2), removeItem(e2) {
    ne.removeStorageSync(e2);
  }, clear() {
    ne.clearStorageSync();
  } };
  var Et = { genAdapter: function() {
    return { root: {}, reqClass: Tt, localStorage: bt, primaryStorage: "local" };
  }, isMatch: function() {
    return true;
  }, runtime: "uni_app" };
  It.useAdapters(Et);
  const kt = It, Pt = kt.init;
  kt.init = function(e2) {
    e2.env = e2.spaceId;
    const t2 = Pt.call(this, e2);
    t2.config.provider = "tencent", t2.config.spaceId = e2.spaceId;
    const n2 = t2.auth;
    return t2.auth = function(e3) {
      const t3 = n2.call(this, e3);
      return ["linkAndRetrieveDataWithTicket", "signInAnonymously", "signOut", "getAccessToken", "getLoginState", "signInWithTicket", "getUserInfo"].forEach((e4) => {
        var n3;
        t3[e4] = (n3 = t3[e4], function(e5) {
          e5 = e5 || {};
          const { success: t4, fail: s2, complete: r2 } = ee(e5);
          if (!(t4 || s2 || r2))
            return n3.call(this, e5);
          n3.call(this, e5).then((e6) => {
            t4 && t4(e6), r2 && r2(e6);
          }, (e6) => {
            s2 && s2(e6), r2 && r2(e6);
          });
        }).bind(t3);
      }), t3;
    }, t2.customAuth = t2.auth, t2;
  };
  var Ct = kt;
  async function At(e2, t2) {
    const n2 = `http://${e2}:${t2}/system/ping`;
    try {
      const e3 = await (s2 = { url: n2, timeout: 500 }, new Promise((e4, t3) => {
        ne.request({ ...s2, success(t4) {
          e4(t4);
        }, fail(e5) {
          t3(e5);
        } });
      }));
      return !(!e3.data || 0 !== e3.data.code);
    } catch (e3) {
      return false;
    }
    var s2;
  }
  async function Ot(e2, t2) {
    let n2;
    for (let s2 = 0; s2 < e2.length; s2++) {
      const r2 = e2[s2];
      if (await At(r2, t2)) {
        n2 = r2;
        break;
      }
    }
    return { address: n2, port: t2 };
  }
  const xt = { "serverless.file.resource.generateProximalSign": "storage/generate-proximal-sign", "serverless.file.resource.report": "storage/report", "serverless.file.resource.delete": "storage/delete", "serverless.file.resource.getTempFileURL": "storage/get-temp-file-url" };
  var Nt = class {
    constructor(e2) {
      if (["spaceId", "clientSecret"].forEach((t2) => {
        if (!Object.prototype.hasOwnProperty.call(e2, t2))
          throw new Error(`${t2} required`);
      }), !e2.endpoint)
        throw new Error("集群空间未配置ApiEndpoint，配置后需要重新关联服务空间后生效");
      this.config = Object.assign({}, e2), this.config.provider = "dcloud", this.config.requestUrl = this.config.endpoint + "/client", this.config.envType = this.config.envType || "public", this.adapter = ne;
    }
    async request(e2, t2 = true) {
      const n2 = t2;
      return e2 = n2 ? await this.setupLocalRequest(e2) : this.setupRequest(e2), Promise.resolve().then(() => n2 ? this.requestLocal(e2) : de.wrappedRequest(e2, this.adapter.request));
    }
    requestLocal(e2) {
      return new Promise((t2, n2) => {
        this.adapter.request(Object.assign(e2, { complete(e3) {
          if (e3 || (e3 = {}), !e3.statusCode || e3.statusCode >= 400) {
            const t3 = e3.data && e3.data.code || "SYS_ERR", s2 = e3.data && e3.data.message || "request:fail";
            return n2(new te({ code: t3, message: s2 }));
          }
          t2({ success: true, result: e3.data });
        } }));
      });
    }
    setupRequest(e2) {
      const t2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now() }), n2 = { "Content-Type": "application/json" };
      n2["x-serverless-sign"] = de.sign(t2, this.config.clientSecret);
      const s2 = le();
      n2["x-client-info"] = encodeURIComponent(JSON.stringify(s2));
      const { token: r2 } = re();
      return n2["x-client-token"] = r2, { url: this.config.requestUrl, method: "POST", data: t2, dataType: "json", header: JSON.parse(JSON.stringify(n2)) };
    }
    async setupLocalRequest(e2) {
      const t2 = le(), { token: n2 } = re(), s2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now(), clientInfo: t2, token: n2 }), { address: r2, servePort: i2 } = this.__dev__ && this.__dev__.debugInfo || {}, { address: o2 } = await Ot(r2, i2);
      return { url: `http://${o2}:${i2}/${xt[e2.method]}`, method: "POST", data: s2, dataType: "json", header: JSON.parse(JSON.stringify({ "Content-Type": "application/json" })) };
    }
    callFunction(e2) {
      const t2 = { method: "serverless.function.runtime.invoke", params: JSON.stringify({ functionTarget: e2.name, functionArgs: e2.data || {} }) };
      return this.request(t2, false);
    }
    getUploadFileOptions(e2) {
      const t2 = { method: "serverless.file.resource.generateProximalSign", params: JSON.stringify(e2) };
      return this.request(t2);
    }
    reportUploadFile(e2) {
      const t2 = { method: "serverless.file.resource.report", params: JSON.stringify(e2) };
      return this.request(t2);
    }
    uploadFile({ filePath: e2, cloudPath: t2, fileType: n2 = "image", onUploadProgress: s2 }) {
      if (!t2)
        throw new te({ code: "CLOUDPATH_REQUIRED", message: "cloudPath不可为空" });
      let r2;
      return this.getUploadFileOptions({ cloudPath: t2 }).then((t3) => {
        const { url: i2, formData: o2, name: a2 } = t3.result;
        return r2 = t3.result.fileUrl, new Promise((t4, r3) => {
          const c2 = this.adapter.uploadFile({ url: i2, formData: o2, name: a2, filePath: e2, fileType: n2, success(e3) {
            e3 && e3.statusCode < 400 ? t4(e3) : r3(new te({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
          }, fail(e3) {
            r3(new te({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "文件上传失败" }));
          } });
          "function" == typeof s2 && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((e3) => {
            s2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
          });
        });
      }).then(() => this.reportUploadFile({ cloudPath: t2 })).then((t3) => new Promise((n3, s3) => {
        t3.success ? n3({ success: true, filePath: e2, fileID: r2 }) : s3(new te({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
      }));
    }
    deleteFile({ fileList: e2 }) {
      const t2 = { method: "serverless.file.resource.delete", params: JSON.stringify({ fileList: e2 }) };
      return this.request(t2).then((e3) => {
        if (e3.success)
          return e3.result;
        throw new te({ code: "DELETE_FILE_FAILED", message: "删除文件失败" });
      });
    }
    getTempFileURL({ fileList: e2, maxAge: t2 } = {}) {
      if (!Array.isArray(e2) || 0 === e2.length)
        throw new te({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" });
      const n2 = { method: "serverless.file.resource.getTempFileURL", params: JSON.stringify({ fileList: e2, maxAge: t2 }) };
      return this.request(n2).then((e3) => {
        if (e3.success)
          return { fileList: e3.result.fileList.map((e4) => ({ fileID: e4.fileID, tempFileURL: e4.tempFileURL })) };
        throw new te({ code: "GET_TEMP_FILE_URL_FAILED", message: "获取临时文件链接失败" });
      });
    }
  };
  var Rt = { init(e2) {
    const t2 = new Nt(e2), n2 = { signInAnonymously: function() {
      return Promise.resolve();
    }, getLoginState: function() {
      return Promise.resolve(false);
    } };
    return t2.auth = function() {
      return n2;
    }, t2.customAuth = t2.auth, t2;
  } }, Lt = n(function(e2, t2) {
    e2.exports = r.enc.Hex;
  });
  function Ut() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e2) {
      var t2 = 16 * Math.random() | 0;
      return ("x" === e2 ? t2 : 3 & t2 | 8).toString(16);
    });
  }
  function Dt(e2 = "", t2 = {}) {
    const { data: n2, functionName: s2, method: r2, headers: i2, signHeaderKeys: o2 = [], config: a2 } = t2, c2 = String(Date.now()), u2 = Ut(), h2 = Object.assign({}, i2, { "x-from-app-id": a2.spaceAppId, "x-from-env-id": a2.spaceId, "x-to-env-id": a2.spaceId, "x-from-instance-id": c2, "x-from-function-name": s2, "x-client-timestamp": c2, "x-alipay-source": "client", "x-request-id": u2, "x-alipay-callid": u2, "x-trace-id": u2 }), l2 = ["x-from-app-id", "x-from-env-id", "x-to-env-id", "x-from-instance-id", "x-from-function-name", "x-client-timestamp"].concat(o2), [d2 = "", p2 = ""] = e2.split("?") || [], f2 = function(e3) {
      const t3 = "HMAC-SHA256", n3 = e3.signedHeaders.join(";"), s3 = e3.signedHeaders.map((t4) => `${t4.toLowerCase()}:${e3.headers[t4]}
`).join(""), r3 = we(e3.body).toString(Lt), i3 = `${e3.method.toUpperCase()}
${e3.path}
${e3.query}
${s3}
${n3}
${r3}
`, o3 = we(i3).toString(Lt), a3 = `${t3}
${e3.timestamp}
${o3}
`, c3 = ve(a3, e3.secretKey).toString(Lt);
      return `${t3} Credential=${e3.secretId}, SignedHeaders=${n3}, Signature=${c3}`;
    }({ path: d2, query: p2, method: r2, headers: h2, timestamp: c2, body: JSON.stringify(n2), secretId: a2.accessKey, secretKey: a2.secretKey, signedHeaders: l2.sort() });
    return { url: `${a2.endpoint}${e2}`, headers: Object.assign({}, h2, { Authorization: f2 }) };
  }
  function Mt({ url: e2, data: t2, method: n2 = "POST", headers: s2 = {}, timeout: r2 }) {
    return new Promise((i2, o2) => {
      ne.request({ url: e2, method: n2, data: "object" == typeof t2 ? JSON.stringify(t2) : t2, header: s2, dataType: "json", timeout: r2, complete: (e3 = {}) => {
        const t3 = s2["x-trace-id"] || "";
        if (!e3.statusCode || e3.statusCode >= 400) {
          const { message: n3, errMsg: s3, trace_id: r3 } = e3.data || {};
          return o2(new te({ code: "SYS_ERR", message: n3 || s3 || "request:fail", requestId: r3 || t3 }));
        }
        i2({ status: e3.statusCode, data: e3.data, headers: e3.header, requestId: t3 });
      } });
    });
  }
  function qt(e2, t2) {
    const { path: n2, data: s2, method: r2 = "GET" } = e2, { url: i2, headers: o2 } = Dt(n2, { functionName: "", data: s2, method: r2, headers: { "x-alipay-cloud-mode": "oss", "x-data-api-type": "oss", "x-expire-timestamp": Date.now() + 6e4 }, signHeaderKeys: ["x-data-api-type", "x-expire-timestamp"], config: t2 });
    return Mt({ url: i2, data: s2, method: r2, headers: o2 }).then((e3) => {
      const t3 = e3.data || {};
      if (!t3.success)
        throw new te({ code: e3.errCode, message: e3.errMsg, requestId: e3.requestId });
      return t3.data || {};
    }).catch((e3) => {
      throw new te({ code: e3.errCode, message: e3.errMsg, requestId: e3.requestId });
    });
  }
  function Ft(e2 = "") {
    const t2 = e2.trim().replace(/^cloud:\/\//, ""), n2 = t2.indexOf("/");
    if (n2 <= 0)
      throw new te({ code: "INVALID_PARAM", message: "fileID不合法" });
    const s2 = t2.substring(0, n2), r2 = t2.substring(n2 + 1);
    return s2 !== this.config.spaceId && console.warn("file ".concat(e2, " does not belong to env ").concat(this.config.spaceId)), r2;
  }
  function Kt(e2 = "") {
    return "cloud://".concat(this.config.spaceId, "/").concat(e2.replace(/^\/+/, ""));
  }
  class jt {
    constructor(e2) {
      this.config = e2;
    }
    signedURL(e2, t2 = {}) {
      const n2 = `/ws/function/${e2}`, s2 = this.config.wsEndpoint.replace(/^ws(s)?:\/\//, ""), r2 = Object.assign({}, t2, { accessKeyId: this.config.accessKey, signatureNonce: Ut(), timestamp: "" + Date.now() }), i2 = [n2, ["accessKeyId", "authorization", "signatureNonce", "timestamp"].sort().map(function(e3) {
        return r2[e3] ? "".concat(e3, "=").concat(r2[e3]) : null;
      }).filter(Boolean).join("&"), `host:${s2}`].join("\n"), o2 = ["HMAC-SHA256", we(i2).toString(Lt)].join("\n"), a2 = ve(o2, this.config.secretKey).toString(Lt), c2 = Object.keys(r2).map((e3) => `${e3}=${encodeURIComponent(r2[e3])}`).join("&");
      return `${this.config.wsEndpoint}${n2}?${c2}&signature=${a2}`;
    }
  }
  var $t = class {
    constructor(e2) {
      if (["spaceId", "spaceAppId", "accessKey", "secretKey"].forEach((t2) => {
        if (!Object.prototype.hasOwnProperty.call(e2, t2))
          throw new Error(`${t2} required`);
      }), e2.endpoint) {
        if ("string" != typeof e2.endpoint)
          throw new Error("endpoint must be string");
        if (!/^https:\/\//.test(e2.endpoint))
          throw new Error("endpoint must start with https://");
        e2.endpoint = e2.endpoint.replace(/\/$/, "");
      }
      this.config = Object.assign({}, e2, { endpoint: e2.endpoint || `https://${e2.spaceId}.api-hz.cloudbasefunction.cn`, wsEndpoint: e2.wsEndpoint || `wss://${e2.spaceId}.api-hz.cloudbasefunction.cn` }), this._websocket = new jt(this.config);
    }
    callFunction(e2) {
      return function(e3, t2) {
        const { name: n2, data: s2, async: r2 = false, timeout: i2 } = e3, o2 = "POST", a2 = { "x-to-function-name": n2 };
        r2 && (a2["x-function-invoke-type"] = "async");
        const { url: c2, headers: u2 } = Dt("/functions/invokeFunction", { functionName: n2, data: s2, method: o2, headers: a2, signHeaderKeys: ["x-to-function-name"], config: t2 });
        return Mt({ url: c2, data: s2, method: o2, headers: u2, timeout: i2 }).then((e4) => {
          let t3 = 0;
          if (r2) {
            const n3 = e4.data || {};
            t3 = "200" === n3.errCode ? 0 : n3.errCode, e4.data = n3.data || {}, e4.errMsg = n3.errMsg;
          }
          if (0 !== t3)
            throw new te({ code: t3, message: e4.errMsg, requestId: e4.requestId });
          return { errCode: t3, success: 0 === t3, requestId: e4.requestId, result: e4.data };
        }).catch((e4) => {
          throw new te({ code: e4.errCode, message: e4.errMsg, requestId: e4.requestId });
        });
      }(e2, this.config);
    }
    uploadFileToOSS({ url: e2, filePath: t2, fileType: n2, formData: s2, onUploadProgress: r2 }) {
      return new Promise((i2, o2) => {
        const a2 = ne.uploadFile({ url: e2, filePath: t2, fileType: n2, formData: s2, name: "file", success(e3) {
          e3 && e3.statusCode < 400 ? i2(e3) : o2(new te({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
        }, fail(e3) {
          o2(new te({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "文件上传失败" }));
        } });
        "function" == typeof r2 && a2 && "function" == typeof a2.onProgressUpdate && a2.onProgressUpdate((e3) => {
          r2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
        });
      });
    }
    async uploadFile({ filePath: e2, cloudPath: t2 = "", fileType: n2 = "image", onUploadProgress: s2 }) {
      if ("string" !== g(t2))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath必须为字符串类型" });
      if (!(t2 = t2.trim()))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath不可为空" });
      if (/:\/\//.test(t2))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath不合法" });
      const r2 = await qt({ path: "/".concat(t2.replace(/^\//, ""), "?post_url") }, this.config), { file_id: i2, upload_url: o2, form_data: a2 } = r2, c2 = a2 && a2.reduce((e3, t3) => (e3[t3.key] = t3.value, e3), {});
      return this.uploadFileToOSS({ url: o2, filePath: e2, fileType: n2, formData: c2, onUploadProgress: s2 }).then(() => ({ fileID: i2 }));
    }
    async getTempFileURL({ fileList: e2 }) {
      return new Promise((t2, n2) => {
        (!e2 || e2.length < 0) && t2({ code: "INVALID_PARAM", message: "fileList不能为空数组" }), e2.length > 50 && t2({ code: "INVALID_PARAM", message: "fileList数组长度不能超过50" });
        const s2 = [];
        for (const n3 of e2) {
          let e3;
          "string" !== g(n3) && t2({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" });
          try {
            e3 = Ft.call(this, n3);
          } catch (t3) {
            console.warn(t3.errCode, t3.errMsg), e3 = n3;
          }
          s2.push({ file_id: e3, expire: 600 });
        }
        qt({ path: "/?download_url", data: { file_list: s2 }, method: "POST" }, this.config).then((e3) => {
          const { file_list: n3 = [] } = e3;
          t2({ fileList: n3.map((e4) => ({ fileID: Kt.call(this, e4.file_id), tempFileURL: e4.download_url })) });
        }).catch((e3) => n2(e3));
      });
    }
    async connectWebSocket(e2) {
      const { name: t2, query: n2 } = e2;
      return ne.connectSocket({ url: this._websocket.signedURL(t2, n2), complete: () => {
      } });
    }
  };
  var Bt = { init: (e2) => {
    e2.provider = "alipay";
    const t2 = new $t(e2);
    return t2.auth = function() {
      return { signInAnonymously: function() {
        return Promise.resolve();
      }, getLoginState: function() {
        return Promise.resolve(true);
      } };
    }, t2;
  } };
  function Wt({ data: e2 }) {
    let t2;
    t2 = le();
    const n2 = JSON.parse(JSON.stringify(e2 || {}));
    if (Object.assign(n2, { clientInfo: t2 }), !n2.uniIdToken) {
      const { token: e3 } = re();
      e3 && (n2.uniIdToken = e3);
    }
    return n2;
  }
  async function Ht(e2 = {}) {
    await this.__dev__.initLocalNetwork();
    const { localAddress: t2, localPort: n2 } = this.__dev__, s2 = { aliyun: "aliyun", tencent: "tcb", alipay: "alipay", dcloud: "dcloud" }[this.config.provider], r2 = this.config.spaceId, i2 = `http://${t2}:${n2}/system/check-function`, o2 = `http://${t2}:${n2}/cloudfunctions/${e2.name}`;
    return new Promise((t3, n3) => {
      ne.request({ method: "POST", url: i2, data: { name: e2.name, platform: C, provider: s2, spaceId: r2 }, timeout: 3e3, success(e3) {
        t3(e3);
      }, fail() {
        t3({ data: { code: "NETWORK_ERROR", message: "连接本地调试服务失败，请检查客户端是否和主机在同一局域网下，自动切换为已部署的云函数。" } });
      } });
    }).then(({ data: e3 } = {}) => {
      const { code: t3, message: n3 } = e3 || {};
      return { code: 0 === t3 ? 0 : t3 || "SYS_ERR", message: n3 || "SYS_ERR" };
    }).then(({ code: t3, message: n3 }) => {
      if (0 !== t3) {
        switch (t3) {
          case "MODULE_ENCRYPTED":
            console.error(`此云函数（${e2.name}）依赖加密公共模块不可本地调试，自动切换为云端已部署的云函数`);
            break;
          case "FUNCTION_ENCRYPTED":
            console.error(`此云函数（${e2.name}）已加密不可本地调试，自动切换为云端已部署的云函数`);
            break;
          case "ACTION_ENCRYPTED":
            console.error(n3 || "需要访问加密的uni-clientDB-action，自动切换为云端环境");
            break;
          case "NETWORK_ERROR":
            console.error(n3 || "连接本地调试服务失败，请检查客户端是否和主机在同一局域网下");
            break;
          case "SWITCH_TO_CLOUD":
            break;
          default: {
            const e3 = `检测本地调试服务出现错误：${n3}，请检查网络环境或重启客户端再试`;
            throw console.error(e3), new Error(e3);
          }
        }
        return this._callCloudFunction(e2);
      }
      return new Promise((t4, n4) => {
        const r3 = Wt.call(this, { data: e2.data });
        ne.request({ method: "POST", url: o2, data: { provider: s2, platform: C, param: r3 }, timeout: e2.timeout, success: ({ statusCode: e3, data: s3 } = {}) => !e3 || e3 >= 400 ? n4(new te({ code: s3.code || "SYS_ERR", message: s3.message || "request:fail" })) : t4({ result: s3 }), fail(e3) {
          n4(new te({ code: e3.code || e3.errCode || "SYS_ERR", message: e3.message || e3.errMsg || "request:fail" }));
        } });
      });
    });
  }
  const Jt = [{ rule: /fc_function_not_found|FUNCTION_NOT_FOUND/, content: "，云函数[{functionName}]在云端不存在，请检查此云函数名称是否正确以及该云函数是否已上传到服务空间", mode: "append" }];
  var zt = /[\\^$.*+?()[\]{}|]/g, Vt = RegExp(zt.source);
  function Gt(e2, t2, n2) {
    return e2.replace(new RegExp((s2 = t2) && Vt.test(s2) ? s2.replace(zt, "\\$&") : s2, "g"), n2);
    var s2;
  }
  const Yt = { NONE: "none", REQUEST: "request", RESPONSE: "response", BOTH: "both" }, Qt = "_globalUniCloudStatus", Xt = "_globalUniCloudSecureNetworkCache__{spaceId}";
  const Un = "uni-secure-network", Dn = { SYSTEM_ERROR: { code: 2e4, message: "System error" }, APP_INFO_INVALID: { code: 20101, message: "Invalid client" }, GET_ENCRYPT_KEY_FAILED: { code: 20102, message: "Get encrypt key failed" } };
  function qn(e2) {
    const { errSubject: t2, subject: n2, errCode: s2, errMsg: r2, code: i2, message: o2, cause: a2 } = e2 || {};
    return new te({ subject: t2 || n2 || Un, code: s2 || i2 || Dn.SYSTEM_ERROR.code, message: r2 || o2, cause: a2 });
  }
  let Kn;
  function Hn({ secretType: e2 } = {}) {
    return e2 === Yt.REQUEST || e2 === Yt.RESPONSE || e2 === Yt.BOTH;
  }
  function Jn({ name: e2, data: t2 = {} } = {}) {
    return "DCloud-clientDB" === e2 && "encryption" === t2.redirectTo && "getAppClientKey" === t2.action;
  }
  function zn({ provider: e2, spaceId: t2, functionName: n2 } = {}) {
    const { appId: s2, uniPlatform: r2, osName: i2 } = ce();
    let o2 = r2;
    "app" === r2 && (o2 = i2);
    const a2 = function({ provider: e3, spaceId: t3 } = {}) {
      const n3 = P;
      if (!n3)
        return {};
      e3 = /* @__PURE__ */ function(e4) {
        return "tencent" === e4 ? "tcb" : e4;
      }(e3);
      const s3 = n3.find((n4) => n4.provider === e3 && n4.spaceId === t3);
      return s3 && s3.config;
    }({ provider: e2, spaceId: t2 });
    if (!a2 || !a2.accessControl || !a2.accessControl.enable)
      return false;
    const c2 = a2.accessControl.function || {}, u2 = Object.keys(c2);
    if (0 === u2.length)
      return true;
    const h2 = function(e3, t3) {
      let n3, s3, r3;
      for (let i3 = 0; i3 < e3.length; i3++) {
        const o3 = e3[i3];
        o3 !== t3 ? "*" !== o3 ? o3.split(",").map((e4) => e4.trim()).indexOf(t3) > -1 && (s3 = o3) : r3 = o3 : n3 = o3;
      }
      return n3 || s3 || r3;
    }(u2, n2);
    if (!h2)
      return false;
    if ((c2[h2] || []).find((e3 = {}) => e3.appId === s2 && (e3.platform || "").toLowerCase() === o2.toLowerCase()))
      return true;
    throw console.error(`此应用[appId: ${s2}, platform: ${o2}]不在云端配置的允许访问的应用列表内，参考：https://uniapp.dcloud.net.cn/uniCloud/secure-network.html#verify-client`), qn(Dn.APP_INFO_INVALID);
  }
  function Vn({ functionName: e2, result: t2, logPvd: n2 }) {
    if (this.__dev__.debugLog && t2 && t2.requestId) {
      const s2 = JSON.stringify({ spaceId: this.config.spaceId, functionName: e2, requestId: t2.requestId });
      console.log(`[${n2}-request]${s2}[/${n2}-request]`);
    }
  }
  function Gn(e2) {
    const t2 = e2.callFunction, n2 = function(n3) {
      const s2 = n3.name;
      n3.data = Wt.call(e2, { data: n3.data });
      const r2 = { aliyun: "aliyun", tencent: "tcb", tcb: "tcb", alipay: "alipay", dcloud: "dcloud" }[this.config.provider], i2 = Hn(n3), o2 = Jn(n3), a2 = i2 || o2;
      return t2.call(this, n3).then((e3) => (e3.errCode = 0, !a2 && Vn.call(this, { functionName: s2, result: e3, logPvd: r2 }), Promise.resolve(e3)), (e3) => (!a2 && Vn.call(this, { functionName: s2, result: e3, logPvd: r2 }), e3 && e3.message && (e3.message = function({ message: e4 = "", extraInfo: t3 = {}, formatter: n4 = [] } = {}) {
        for (let s3 = 0; s3 < n4.length; s3++) {
          const { rule: r3, content: i3, mode: o3 } = n4[s3], a3 = e4.match(r3);
          if (!a3)
            continue;
          let c2 = i3;
          for (let e5 = 1; e5 < a3.length; e5++)
            c2 = Gt(c2, `{$${e5}}`, a3[e5]);
          for (const e5 in t3)
            c2 = Gt(c2, `{${e5}}`, t3[e5]);
          return "replace" === o3 ? c2 : e4 + c2;
        }
        return e4;
      }({ message: `[${n3.name}]: ${e3.message}`, formatter: Jt, extraInfo: { functionName: s2 } })), Promise.reject(e3)));
    };
    e2.callFunction = function(t3) {
      const { provider: s2, spaceId: r2 } = e2.config, i2 = t3.name;
      let o2, a2;
      if (t3.data = t3.data || {}, e2.__dev__.debugInfo && !e2.__dev__.debugInfo.forceRemote && O ? (e2._callCloudFunction || (e2._callCloudFunction = n2, e2._callLocalFunction = Ht), o2 = Ht) : o2 = n2, o2 = o2.bind(e2), Jn(t3))
        a2 = n2.call(e2, t3);
      else if (Hn(t3)) {
        a2 = new Kn({ secretType: t3.secretType, uniCloudIns: e2 }).wrapEncryptDataCallFunction(n2.bind(e2))(t3);
      } else if (zn({ provider: s2, spaceId: r2, functionName: i2 })) {
        a2 = new Kn({ secretType: t3.secretType, uniCloudIns: e2 }).wrapVerifyClientCallFunction(n2.bind(e2))(t3);
      } else
        a2 = o2(t3);
      return Object.defineProperty(a2, "result", { get: () => (console.warn("当前返回结果为Promise类型，不可直接访问其result属性，详情请参考：https://uniapp.dcloud.net.cn/uniCloud/faq?id=promise"), {}) }), a2.then((e3) => ("undefined" != typeof UTSJSONObject && (e3.result = new UTSJSONObject(e3.result)), e3));
    };
  }
  Kn = class {
    constructor() {
      throw qn({ message: `Platform ${C} is not enabled, please check whether secure network module is enabled in your manifest.json` });
    }
  };
  const Yn = Symbol("CLIENT_DB_INTERNAL");
  function Qn(e2, t2) {
    return e2.then = "DoNotReturnProxyWithAFunctionNamedThen", e2._internalType = Yn, e2.inspect = null, e2.__v_raw = void 0, new Proxy(e2, { get(e3, n2, s2) {
      if ("_uniClient" === n2)
        return null;
      if ("symbol" == typeof n2)
        return e3[n2];
      if (n2 in e3 || "string" != typeof n2) {
        const t3 = e3[n2];
        return "function" == typeof t3 ? t3.bind(e3) : t3;
      }
      return t2.get(e3, n2, s2);
    } });
  }
  function Xn(e2) {
    return { on: (t2, n2) => {
      e2[t2] = e2[t2] || [], e2[t2].indexOf(n2) > -1 || e2[t2].push(n2);
    }, off: (t2, n2) => {
      e2[t2] = e2[t2] || [];
      const s2 = e2[t2].indexOf(n2);
      -1 !== s2 && e2[t2].splice(s2, 1);
    } };
  }
  const Zn = ["db.Geo", "db.command", "command.aggregate"];
  function es(e2, t2) {
    return Zn.indexOf(`${e2}.${t2}`) > -1;
  }
  function ts(e2) {
    switch (g(e2 = se(e2))) {
      case "array":
        return e2.map((e3) => ts(e3));
      case "object":
        return e2._internalType === Yn || Object.keys(e2).forEach((t2) => {
          e2[t2] = ts(e2[t2]);
        }), e2;
      case "regexp":
        return { $regexp: { source: e2.source, flags: e2.flags } };
      case "date":
        return { $date: e2.toISOString() };
      default:
        return e2;
    }
  }
  function ns(e2) {
    return e2 && e2.content && e2.content.$method;
  }
  class ss {
    constructor(e2, t2, n2) {
      this.content = e2, this.prevStage = t2 || null, this.udb = null, this._database = n2;
    }
    toJSON() {
      let e2 = this;
      const t2 = [e2.content];
      for (; e2.prevStage; )
        e2 = e2.prevStage, t2.push(e2.content);
      return { $db: t2.reverse().map((e3) => ({ $method: e3.$method, $param: ts(e3.$param) })) };
    }
    toString() {
      return JSON.stringify(this.toJSON());
    }
    getAction() {
      const e2 = this.toJSON().$db.find((e3) => "action" === e3.$method);
      return e2 && e2.$param && e2.$param[0];
    }
    getCommand() {
      return { $db: this.toJSON().$db.filter((e2) => "action" !== e2.$method) };
    }
    get isAggregate() {
      let e2 = this;
      for (; e2; ) {
        const t2 = ns(e2), n2 = ns(e2.prevStage);
        if ("aggregate" === t2 && "collection" === n2 || "pipeline" === t2)
          return true;
        e2 = e2.prevStage;
      }
      return false;
    }
    get isCommand() {
      let e2 = this;
      for (; e2; ) {
        if ("command" === ns(e2))
          return true;
        e2 = e2.prevStage;
      }
      return false;
    }
    get isAggregateCommand() {
      let e2 = this;
      for (; e2; ) {
        const t2 = ns(e2), n2 = ns(e2.prevStage);
        if ("aggregate" === t2 && "command" === n2)
          return true;
        e2 = e2.prevStage;
      }
      return false;
    }
    getNextStageFn(e2) {
      const t2 = this;
      return function() {
        return rs({ $method: e2, $param: ts(Array.from(arguments)) }, t2, t2._database);
      };
    }
    get count() {
      return this.isAggregate ? this.getNextStageFn("count") : function() {
        return this._send("count", Array.from(arguments));
      };
    }
    get remove() {
      return this.isCommand ? this.getNextStageFn("remove") : function() {
        return this._send("remove", Array.from(arguments));
      };
    }
    get() {
      return this._send("get", Array.from(arguments));
    }
    get add() {
      return this.isCommand ? this.getNextStageFn("add") : function() {
        return this._send("add", Array.from(arguments));
      };
    }
    update() {
      return this._send("update", Array.from(arguments));
    }
    end() {
      return this._send("end", Array.from(arguments));
    }
    get set() {
      return this.isCommand ? this.getNextStageFn("set") : function() {
        throw new Error("JQL禁止使用set方法");
      };
    }
    _send(e2, t2) {
      const n2 = this.getAction(), s2 = this.getCommand();
      if (s2.$db.push({ $method: e2, $param: ts(t2) }), b) {
        const e3 = s2.$db.find((e4) => "collection" === e4.$method), t3 = e3 && e3.$param;
        t3 && 1 === t3.length && "string" == typeof e3.$param[0] && e3.$param[0].indexOf(",") > -1 && console.warn("检测到使用JQL语法联表查询时，未使用getTemp先过滤主表数据，在主表数据量大的情况下可能会查询缓慢。\n- 如何优化请参考此文档：https://uniapp.dcloud.net.cn/uniCloud/jql?id=lookup-with-temp \n- 如果主表数据量很小请忽略此信息，项目发行时不会出现此提示。");
      }
      return this._database._callCloudFunction({ action: n2, command: s2 });
    }
  }
  function rs(e2, t2, n2) {
    return Qn(new ss(e2, t2, n2), { get(e3, t3) {
      let s2 = "db";
      return e3 && e3.content && (s2 = e3.content.$method), es(s2, t3) ? rs({ $method: t3 }, e3, n2) : function() {
        return rs({ $method: t3, $param: ts(Array.from(arguments)) }, e3, n2);
      };
    } });
  }
  function is({ path: e2, method: t2 }) {
    return class {
      constructor() {
        this.param = Array.from(arguments);
      }
      toJSON() {
        return { $newDb: [...e2.map((e3) => ({ $method: e3 })), { $method: t2, $param: this.param }] };
      }
      toString() {
        return JSON.stringify(this.toJSON());
      }
    };
  }
  let os$1 = class os {
    constructor({ uniClient: e2 = {}, isJQL: t2 = false } = {}) {
      this._uniClient = e2, this._authCallBacks = {}, this._dbCallBacks = {}, e2._isDefault && (this._dbCallBacks = U("_globalUniCloudDatabaseCallback")), t2 || (this.auth = Xn(this._authCallBacks)), this._isJQL = t2, Object.assign(this, Xn(this._dbCallBacks)), this.env = Qn({}, { get: (e3, t3) => ({ $env: t3 }) }), this.Geo = Qn({}, { get: (e3, t3) => is({ path: ["Geo"], method: t3 }) }), this.serverDate = is({ path: [], method: "serverDate" }), this.RegExp = is({ path: [], method: "RegExp" });
    }
    getCloudEnv(e2) {
      if ("string" != typeof e2 || !e2.trim())
        throw new Error("getCloudEnv参数错误");
      return { $env: e2.replace("$cloudEnv_", "") };
    }
    _callback(e2, t2) {
      const n2 = this._dbCallBacks;
      n2[e2] && n2[e2].forEach((e3) => {
        e3(...t2);
      });
    }
    _callbackAuth(e2, t2) {
      const n2 = this._authCallBacks;
      n2[e2] && n2[e2].forEach((e3) => {
        e3(...t2);
      });
    }
    multiSend() {
      const e2 = Array.from(arguments), t2 = e2.map((e3) => {
        const t3 = e3.getAction(), n2 = e3.getCommand();
        if ("getTemp" !== n2.$db[n2.$db.length - 1].$method)
          throw new Error("multiSend只支持子命令内使用getTemp");
        return { action: t3, command: n2 };
      });
      return this._callCloudFunction({ multiCommand: t2, queryList: e2 });
    }
  };
  function as(e2, t2 = {}) {
    return Qn(new e2(t2), { get: (e3, t3) => es("db", t3) ? rs({ $method: t3 }, null, e3) : function() {
      return rs({ $method: t3, $param: ts(Array.from(arguments)) }, null, e3);
    } });
  }
  class cs extends os$1 {
    _parseResult(e2) {
      return this._isJQL ? e2.result : e2;
    }
    _callCloudFunction({ action: e2, command: t2, multiCommand: n2, queryList: s2 }) {
      function r2(e3, t3) {
        if (n2 && s2)
          for (let n3 = 0; n3 < s2.length; n3++) {
            const r3 = s2[n3];
            r3.udb && "function" == typeof r3.udb.setResult && (t3 ? r3.udb.setResult(t3) : r3.udb.setResult(e3.result.dataList[n3]));
          }
      }
      const i2 = this, o2 = this._isJQL ? "databaseForJQL" : "database";
      function a2(e3) {
        return i2._callback("error", [e3]), j($(o2, "fail"), e3).then(() => j($(o2, "complete"), e3)).then(() => (r2(null, e3), Y(H.RESPONSE, { type: J.CLIENT_DB, content: e3 }), Promise.reject(e3)));
      }
      const c2 = j($(o2, "invoke")), u2 = this._uniClient;
      return c2.then(() => u2.callFunction({ name: "DCloud-clientDB", type: l.CLIENT_DB, data: { action: e2, command: t2, multiCommand: n2 } })).then((e3) => {
        const { code: t3, message: n3, token: s3, tokenExpired: c3, systemInfo: u3 = [] } = e3.result;
        if (u3)
          for (let e4 = 0; e4 < u3.length; e4++) {
            const { level: t4, message: n4, detail: s4 } = u3[e4];
            let r3 = "[System Info]" + n4;
            s4 && (r3 = `${r3}
详细信息：${s4}`), (console["warn" === t4 ? "error" : t4] || console.log)(r3);
          }
        if (t3) {
          return a2(new te({ code: t3, message: n3, requestId: e3.requestId }));
        }
        e3.result.errCode = e3.result.errCode || e3.result.code, e3.result.errMsg = e3.result.errMsg || e3.result.message, s3 && c3 && (ie({ token: s3, tokenExpired: c3 }), this._callbackAuth("refreshToken", [{ token: s3, tokenExpired: c3 }]), this._callback("refreshToken", [{ token: s3, tokenExpired: c3 }]), Y(H.REFRESH_TOKEN, { token: s3, tokenExpired: c3 }));
        const h2 = [{ prop: "affectedDocs", tips: "affectedDocs不再推荐使用，请使用inserted/deleted/updated/data.length替代" }, { prop: "code", tips: "code不再推荐使用，请使用errCode替代" }, { prop: "message", tips: "message不再推荐使用，请使用errMsg替代" }];
        for (let t4 = 0; t4 < h2.length; t4++) {
          const { prop: n4, tips: s4 } = h2[t4];
          if (n4 in e3.result) {
            const t5 = e3.result[n4];
            Object.defineProperty(e3.result, n4, { get: () => (console.warn(s4), t5) });
          }
        }
        return function(e4) {
          return j($(o2, "success"), e4).then(() => j($(o2, "complete"), e4)).then(() => {
            r2(e4, null);
            const t4 = i2._parseResult(e4);
            return Y(H.RESPONSE, { type: J.CLIENT_DB, content: t4 }), Promise.resolve(t4);
          });
        }(e3);
      }, (e3) => {
        /fc_function_not_found|FUNCTION_NOT_FOUND/g.test(e3.message) && console.warn("clientDB未初始化，请在web控制台保存一次schema以开启clientDB");
        return a2(new te({ code: e3.code || "SYSTEM_ERROR", message: e3.message, requestId: e3.requestId }));
      });
    }
  }
  const us = "token无效，跳转登录页面", hs = "token过期，跳转登录页面", ls = { TOKEN_INVALID_TOKEN_EXPIRED: hs, TOKEN_INVALID_INVALID_CLIENTID: us, TOKEN_INVALID: us, TOKEN_INVALID_WRONG_TOKEN: us, TOKEN_INVALID_ANONYMOUS_USER: us }, ds = { "uni-id-token-expired": hs, "uni-id-check-token-failed": us, "uni-id-token-not-exist": us, "uni-id-check-device-feature-failed": us };
  function ps(e2, t2) {
    let n2 = "";
    return n2 = e2 ? `${e2}/${t2}` : t2, n2.replace(/^\//, "");
  }
  function fs(e2 = [], t2 = "") {
    const n2 = [], s2 = [];
    return e2.forEach((e3) => {
      true === e3.needLogin ? n2.push(ps(t2, e3.path)) : false === e3.needLogin && s2.push(ps(t2, e3.path));
    }), { needLoginPage: n2, notNeedLoginPage: s2 };
  }
  function gs(e2) {
    return e2.split("?")[0].replace(/^\//, "");
  }
  function ms() {
    return function(e2) {
      let t2 = e2 && e2.$page && e2.$page.fullPath || "";
      return t2 ? ("/" !== t2.charAt(0) && (t2 = "/" + t2), t2) : t2;
    }(function() {
      const e2 = getCurrentPages();
      return e2[e2.length - 1];
    }());
  }
  function ys() {
    return gs(ms());
  }
  function _s(e2 = "", t2 = {}) {
    if (!e2)
      return false;
    if (!(t2 && t2.list && t2.list.length))
      return false;
    const n2 = t2.list, s2 = gs(e2);
    return n2.some((e3) => e3.pagePath === s2);
  }
  const ws = !!e.uniIdRouter;
  const { loginPage: vs, routerNeedLogin: Is, resToLogin: Ss, needLoginPage: Ts, notNeedLoginPage: bs, loginPageInTabBar: Es } = function({ pages: t2 = [], subPackages: n2 = [], uniIdRouter: s2 = {}, tabBar: r2 = {} } = e) {
    const { loginPage: i2, needLogin: o2 = [], resToLogin: a2 = true } = s2, { needLoginPage: c2, notNeedLoginPage: u2 } = fs(t2), { needLoginPage: h2, notNeedLoginPage: l2 } = function(e2 = []) {
      const t3 = [], n3 = [];
      return e2.forEach((e3) => {
        const { root: s3, pages: r3 = [] } = e3, { needLoginPage: i3, notNeedLoginPage: o3 } = fs(r3, s3);
        t3.push(...i3), n3.push(...o3);
      }), { needLoginPage: t3, notNeedLoginPage: n3 };
    }(n2);
    return { loginPage: i2, routerNeedLogin: o2, resToLogin: a2, needLoginPage: [...c2, ...h2], notNeedLoginPage: [...u2, ...l2], loginPageInTabBar: _s(i2, r2) };
  }();
  if (Ts.indexOf(vs) > -1)
    throw new Error(`Login page [${vs}] should not be "needLogin", please check your pages.json`);
  function ks(e2) {
    const t2 = ys();
    if ("/" === e2.charAt(0))
      return e2;
    const [n2, s2] = e2.split("?"), r2 = n2.replace(/^\//, "").split("/"), i2 = t2.split("/");
    i2.pop();
    for (let e3 = 0; e3 < r2.length; e3++) {
      const t3 = r2[e3];
      ".." === t3 ? i2.pop() : "." !== t3 && i2.push(t3);
    }
    return "" === i2[0] && i2.shift(), "/" + i2.join("/") + (s2 ? "?" + s2 : "");
  }
  function Ps(e2) {
    const t2 = gs(ks(e2));
    return !(bs.indexOf(t2) > -1) && (Ts.indexOf(t2) > -1 || Is.some((t3) => function(e3, t4) {
      return new RegExp(t4).test(e3);
    }(e2, t3)));
  }
  function Cs({ redirect: e2 }) {
    const t2 = gs(e2), n2 = gs(vs);
    return ys() !== n2 && t2 !== n2;
  }
  function As({ api: e2, redirect: t2 } = {}) {
    if (!t2 || !Cs({ redirect: t2 }))
      return;
    const n2 = function(e3, t3) {
      return "/" !== e3.charAt(0) && (e3 = "/" + e3), t3 ? e3.indexOf("?") > -1 ? e3 + `&uniIdRedirectUrl=${encodeURIComponent(t3)}` : e3 + `?uniIdRedirectUrl=${encodeURIComponent(t3)}` : e3;
    }(vs, t2);
    Es ? "navigateTo" !== e2 && "redirectTo" !== e2 || (e2 = "switchTab") : "switchTab" === e2 && (e2 = "navigateTo");
    const s2 = { navigateTo: uni.navigateTo, redirectTo: uni.redirectTo, switchTab: uni.switchTab, reLaunch: uni.reLaunch };
    setTimeout(() => {
      s2[e2]({ url: n2 });
    }, 0);
  }
  function Os({ url: e2 } = {}) {
    const t2 = { abortLoginPageJump: false, autoToLoginPage: false }, n2 = function() {
      const { token: e3, tokenExpired: t3 } = re();
      let n3;
      if (e3) {
        if (t3 < Date.now()) {
          const e4 = "uni-id-token-expired";
          n3 = { errCode: e4, errMsg: ds[e4] };
        }
      } else {
        const e4 = "uni-id-check-token-failed";
        n3 = { errCode: e4, errMsg: ds[e4] };
      }
      return n3;
    }();
    if (Ps(e2) && n2) {
      n2.uniIdRedirectUrl = e2;
      if (z(H.NEED_LOGIN).length > 0)
        return setTimeout(() => {
          Y(H.NEED_LOGIN, n2);
        }, 0), t2.abortLoginPageJump = true, t2;
      t2.autoToLoginPage = true;
    }
    return t2;
  }
  function xs() {
    !function() {
      const e3 = ms(), { abortLoginPageJump: t2, autoToLoginPage: n2 } = Os({ url: e3 });
      t2 || n2 && As({ api: "redirectTo", redirect: e3 });
    }();
    const e2 = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
    for (let t2 = 0; t2 < e2.length; t2++) {
      const n2 = e2[t2];
      uni.addInterceptor(n2, { invoke(e3) {
        const { abortLoginPageJump: t3, autoToLoginPage: s2 } = Os({ url: e3.url });
        return t3 ? e3 : s2 ? (As({ api: n2, redirect: ks(e3.url) }), false) : e3;
      } });
    }
  }
  function Ns() {
    this.onResponse((e2) => {
      const { type: t2, content: n2 } = e2;
      let s2 = false;
      switch (t2) {
        case "cloudobject":
          s2 = function(e3) {
            if ("object" != typeof e3)
              return false;
            const { errCode: t3 } = e3 || {};
            return t3 in ds;
          }(n2);
          break;
        case "clientdb":
          s2 = function(e3) {
            if ("object" != typeof e3)
              return false;
            const { errCode: t3 } = e3 || {};
            return t3 in ls;
          }(n2);
      }
      s2 && function(e3 = {}) {
        const t3 = z(H.NEED_LOGIN);
        Z().then(() => {
          const n3 = ms();
          if (n3 && Cs({ redirect: n3 }))
            return t3.length > 0 ? Y(H.NEED_LOGIN, Object.assign({ uniIdRedirectUrl: n3 }, e3)) : void (vs && As({ api: "navigateTo", redirect: n3 }));
        });
      }(n2);
    });
  }
  function Rs(e2) {
    !function(e3) {
      e3.onResponse = function(e4) {
        V(H.RESPONSE, e4);
      }, e3.offResponse = function(e4) {
        G(H.RESPONSE, e4);
      };
    }(e2), function(e3) {
      e3.onNeedLogin = function(e4) {
        V(H.NEED_LOGIN, e4);
      }, e3.offNeedLogin = function(e4) {
        G(H.NEED_LOGIN, e4);
      }, ws && (U(Qt).needLoginInit || (U(Qt).needLoginInit = true, Z().then(() => {
        xs.call(e3);
      }), Ss && Ns.call(e3)));
    }(e2), function(e3) {
      e3.onRefreshToken = function(e4) {
        V(H.REFRESH_TOKEN, e4);
      }, e3.offRefreshToken = function(e4) {
        G(H.REFRESH_TOKEN, e4);
      };
    }(e2);
  }
  let Ls;
  const Us = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", Ds = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
  function Ms() {
    const e2 = re().token || "", t2 = e2.split(".");
    if (!e2 || 3 !== t2.length)
      return { uid: null, role: [], permission: [], tokenExpired: 0 };
    let n2;
    try {
      n2 = JSON.parse((s2 = t2[1], decodeURIComponent(Ls(s2).split("").map(function(e3) {
        return "%" + ("00" + e3.charCodeAt(0).toString(16)).slice(-2);
      }).join(""))));
    } catch (e3) {
      throw new Error("获取当前用户信息出错，详细错误信息为：" + e3.message);
    }
    var s2;
    return n2.tokenExpired = 1e3 * n2.exp, delete n2.exp, delete n2.iat, n2;
  }
  Ls = "function" != typeof atob ? function(e2) {
    if (e2 = String(e2).replace(/[\t\n\f\r ]+/g, ""), !Ds.test(e2))
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    var t2;
    e2 += "==".slice(2 - (3 & e2.length));
    for (var n2, s2, r2 = "", i2 = 0; i2 < e2.length; )
      t2 = Us.indexOf(e2.charAt(i2++)) << 18 | Us.indexOf(e2.charAt(i2++)) << 12 | (n2 = Us.indexOf(e2.charAt(i2++))) << 6 | (s2 = Us.indexOf(e2.charAt(i2++))), r2 += 64 === n2 ? String.fromCharCode(t2 >> 16 & 255) : 64 === s2 ? String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255) : String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255, 255 & t2);
    return r2;
  } : atob;
  var qs = n(function(e2, t2) {
    Object.defineProperty(t2, "__esModule", { value: true });
    const n2 = "chooseAndUploadFile:ok", s2 = "chooseAndUploadFile:fail";
    function r2(e3, t3) {
      return e3.tempFiles.forEach((e4, n3) => {
        e4.name || (e4.name = e4.path.substring(e4.path.lastIndexOf("/") + 1)), t3 && (e4.fileType = t3), e4.cloudPath = Date.now() + "_" + n3 + e4.name.substring(e4.name.lastIndexOf("."));
      }), e3.tempFilePaths || (e3.tempFilePaths = e3.tempFiles.map((e4) => e4.path)), e3;
    }
    function i2(e3, t3, { onChooseFile: s3, onUploadProgress: r3 }) {
      return t3.then((e4) => {
        if (s3) {
          const t4 = s3(e4);
          if (void 0 !== t4)
            return Promise.resolve(t4).then((t5) => void 0 === t5 ? e4 : t5);
        }
        return e4;
      }).then((t4) => false === t4 ? { errMsg: n2, tempFilePaths: [], tempFiles: [] } : function(e4, t5, s4 = 5, r4) {
        (t5 = Object.assign({}, t5)).errMsg = n2;
        const i3 = t5.tempFiles, o2 = i3.length;
        let a2 = 0;
        return new Promise((n3) => {
          for (; a2 < s4; )
            c2();
          function c2() {
            const s5 = a2++;
            if (s5 >= o2)
              return void (!i3.find((e5) => !e5.url && !e5.errMsg) && n3(t5));
            const u2 = i3[s5];
            e4.uploadFile({ provider: u2.provider, filePath: u2.path, cloudPath: u2.cloudPath, fileType: u2.fileType, cloudPathAsRealPath: u2.cloudPathAsRealPath, onUploadProgress(e5) {
              e5.index = s5, e5.tempFile = u2, e5.tempFilePath = u2.path, r4 && r4(e5);
            } }).then((e5) => {
              u2.url = e5.fileID, s5 < o2 && c2();
            }).catch((e5) => {
              u2.errMsg = e5.errMsg || e5.message, s5 < o2 && c2();
            });
          }
        });
      }(e3, t4, 5, r3));
    }
    t2.initChooseAndUploadFile = function(e3) {
      return function(t3 = { type: "all" }) {
        return "image" === t3.type ? i2(e3, function(e4) {
          const { count: t4, sizeType: n3, sourceType: i3 = ["album", "camera"], extension: o2 } = e4;
          return new Promise((e5, a2) => {
            uni.chooseImage({ count: t4, sizeType: n3, sourceType: i3, extension: o2, success(t5) {
              e5(r2(t5, "image"));
            }, fail(e6) {
              a2({ errMsg: e6.errMsg.replace("chooseImage:fail", s2) });
            } });
          });
        }(t3), t3) : "video" === t3.type ? i2(e3, function(e4) {
          const { camera: t4, compressed: n3, maxDuration: i3, sourceType: o2 = ["album", "camera"], extension: a2 } = e4;
          return new Promise((e5, c2) => {
            uni.chooseVideo({ camera: t4, compressed: n3, maxDuration: i3, sourceType: o2, extension: a2, success(t5) {
              const { tempFilePath: n4, duration: s3, size: i4, height: o3, width: a3 } = t5;
              e5(r2({ errMsg: "chooseVideo:ok", tempFilePaths: [n4], tempFiles: [{ name: t5.tempFile && t5.tempFile.name || "", path: n4, size: i4, type: t5.tempFile && t5.tempFile.type || "", width: a3, height: o3, duration: s3, fileType: "video", cloudPath: "" }] }, "video"));
            }, fail(e6) {
              c2({ errMsg: e6.errMsg.replace("chooseVideo:fail", s2) });
            } });
          });
        }(t3), t3) : i2(e3, function(e4) {
          const { count: t4, extension: n3 } = e4;
          return new Promise((e5, i3) => {
            let o2 = uni.chooseFile;
            if ("undefined" != typeof wx && "function" == typeof wx.chooseMessageFile && (o2 = wx.chooseMessageFile), "function" != typeof o2)
              return i3({ errMsg: s2 + " 请指定 type 类型，该平台仅支持选择 image 或 video。" });
            o2({ type: "all", count: t4, extension: n3, success(t5) {
              e5(r2(t5));
            }, fail(e6) {
              i3({ errMsg: e6.errMsg.replace("chooseFile:fail", s2) });
            } });
          });
        }(t3), t3);
      };
    };
  }), Fs = t(qs);
  const Ks = { auto: "auto", onready: "onready", manual: "manual" };
  function js(e2) {
    return { props: { localdata: { type: Array, default: () => [] }, options: { type: [Object, Array], default: () => ({}) }, spaceInfo: { type: Object, default: () => ({}) }, collection: { type: [String, Array], default: "" }, action: { type: String, default: "" }, field: { type: String, default: "" }, orderby: { type: String, default: "" }, where: { type: [String, Object], default: "" }, pageData: { type: String, default: "add" }, pageCurrent: { type: Number, default: 1 }, pageSize: { type: Number, default: 20 }, getcount: { type: [Boolean, String], default: false }, gettree: { type: [Boolean, String], default: false }, gettreepath: { type: [Boolean, String], default: false }, startwith: { type: String, default: "" }, limitlevel: { type: Number, default: 10 }, groupby: { type: String, default: "" }, groupField: { type: String, default: "" }, distinct: { type: [Boolean, String], default: false }, foreignKey: { type: String, default: "" }, loadtime: { type: String, default: "auto" }, manual: { type: Boolean, default: false } }, data: () => ({ mixinDatacomLoading: false, mixinDatacomHasMore: false, mixinDatacomResData: [], mixinDatacomErrorMessage: "", mixinDatacomPage: {}, mixinDatacomError: null }), created() {
      this.mixinDatacomPage = { current: this.pageCurrent, size: this.pageSize, count: 0 }, this.$watch(() => {
        var e3 = [];
        return ["pageCurrent", "pageSize", "localdata", "collection", "action", "field", "orderby", "where", "getont", "getcount", "gettree", "groupby", "groupField", "distinct"].forEach((t2) => {
          e3.push(this[t2]);
        }), e3;
      }, (e3, t2) => {
        if (this.loadtime === Ks.manual)
          return;
        let n2 = false;
        const s2 = [];
        for (let r2 = 2; r2 < e3.length; r2++)
          e3[r2] !== t2[r2] && (s2.push(e3[r2]), n2 = true);
        e3[0] !== t2[0] && (this.mixinDatacomPage.current = this.pageCurrent), this.mixinDatacomPage.size = this.pageSize, this.onMixinDatacomPropsChange(n2, s2);
      });
    }, methods: { onMixinDatacomPropsChange(e3, t2) {
    }, mixinDatacomEasyGet({ getone: e3 = false, success: t2, fail: n2 } = {}) {
      this.mixinDatacomLoading || (this.mixinDatacomLoading = true, this.mixinDatacomErrorMessage = "", this.mixinDatacomError = null, this.mixinDatacomGet().then((n3) => {
        this.mixinDatacomLoading = false;
        const { data: s2, count: r2 } = n3.result;
        this.getcount && (this.mixinDatacomPage.count = r2), this.mixinDatacomHasMore = s2.length < this.pageSize;
        const i2 = e3 ? s2.length ? s2[0] : void 0 : s2;
        this.mixinDatacomResData = i2, t2 && t2(i2);
      }).catch((e4) => {
        this.mixinDatacomLoading = false, this.mixinDatacomErrorMessage = e4, this.mixinDatacomError = e4, n2 && n2(e4);
      }));
    }, mixinDatacomGet(t2 = {}) {
      let n2;
      t2 = t2 || {}, n2 = "undefined" != typeof __uniX && __uniX ? e2.databaseForJQL(this.spaceInfo) : e2.database(this.spaceInfo);
      const s2 = t2.action || this.action;
      s2 && (n2 = n2.action(s2));
      const r2 = t2.collection || this.collection;
      n2 = Array.isArray(r2) ? n2.collection(...r2) : n2.collection(r2);
      const i2 = t2.where || this.where;
      i2 && Object.keys(i2).length && (n2 = n2.where(i2));
      const o2 = t2.field || this.field;
      o2 && (n2 = n2.field(o2));
      const a2 = t2.foreignKey || this.foreignKey;
      a2 && (n2 = n2.foreignKey(a2));
      const c2 = t2.groupby || this.groupby;
      c2 && (n2 = n2.groupBy(c2));
      const u2 = t2.groupField || this.groupField;
      u2 && (n2 = n2.groupField(u2));
      true === (void 0 !== t2.distinct ? t2.distinct : this.distinct) && (n2 = n2.distinct());
      const h2 = t2.orderby || this.orderby;
      h2 && (n2 = n2.orderBy(h2));
      const l2 = void 0 !== t2.pageCurrent ? t2.pageCurrent : this.mixinDatacomPage.current, d2 = void 0 !== t2.pageSize ? t2.pageSize : this.mixinDatacomPage.size, p2 = void 0 !== t2.getcount ? t2.getcount : this.getcount, f2 = void 0 !== t2.gettree ? t2.gettree : this.gettree, g2 = void 0 !== t2.gettreepath ? t2.gettreepath : this.gettreepath, m2 = { getCount: p2 }, y2 = { limitLevel: void 0 !== t2.limitlevel ? t2.limitlevel : this.limitlevel, startWith: void 0 !== t2.startwith ? t2.startwith : this.startwith };
      return f2 && (m2.getTree = y2), g2 && (m2.getTreePath = y2), n2 = n2.skip(d2 * (l2 - 1)).limit(d2).get(m2), n2;
    } } };
  }
  function $s(e2) {
    return function(t2, n2 = {}) {
      n2 = function(e3, t3 = {}) {
        return e3.customUI = t3.customUI || e3.customUI, e3.parseSystemError = t3.parseSystemError || e3.parseSystemError, Object.assign(e3.loadingOptions, t3.loadingOptions), Object.assign(e3.errorOptions, t3.errorOptions), "object" == typeof t3.secretMethods && (e3.secretMethods = t3.secretMethods), e3;
      }({ customUI: false, loadingOptions: { title: "加载中...", mask: true }, errorOptions: { type: "modal", retry: false } }, n2);
      const { customUI: s2, loadingOptions: r2, errorOptions: i2, parseSystemError: o2 } = n2, a2 = !s2;
      return new Proxy({}, { get(s3, c2) {
        switch (c2) {
          case "toString":
            return "[object UniCloudObject]";
          case "toJSON":
            return {};
        }
        return function({ fn: e3, interceptorName: t3, getCallbackArgs: n3 } = {}) {
          return async function(...s4) {
            const r3 = n3 ? n3({ params: s4 }) : {};
            let i3, o3;
            try {
              return await j($(t3, "invoke"), { ...r3 }), i3 = await e3(...s4), await j($(t3, "success"), { ...r3, result: i3 }), i3;
            } catch (e4) {
              throw o3 = e4, await j($(t3, "fail"), { ...r3, error: o3 }), o3;
            } finally {
              await j($(t3, "complete"), o3 ? { ...r3, error: o3 } : { ...r3, result: i3 });
            }
          };
        }({ fn: async function s4(...u2) {
          let h2;
          a2 && uni.showLoading({ title: r2.title, mask: r2.mask });
          const d2 = { name: t2, type: l.OBJECT, data: { method: c2, params: u2 } };
          "object" == typeof n2.secretMethods && function(e3, t3) {
            const n3 = t3.data.method, s5 = e3.secretMethods || {}, r3 = s5[n3] || s5["*"];
            r3 && (t3.secretType = r3);
          }(n2, d2);
          let p2 = false;
          try {
            h2 = await e2.callFunction(d2);
          } catch (e3) {
            p2 = true, h2 = { result: new te(e3) };
          }
          const { errSubject: f2, errCode: g2, errMsg: m2, newToken: y2 } = h2.result || {};
          if (a2 && uni.hideLoading(), y2 && y2.token && y2.tokenExpired && (ie(y2), Y(H.REFRESH_TOKEN, { ...y2 })), g2) {
            let e3 = m2;
            if (p2 && o2) {
              e3 = (await o2({ objectName: t2, methodName: c2, params: u2, errSubject: f2, errCode: g2, errMsg: m2 })).errMsg || m2;
            }
            if (a2)
              if ("toast" === i2.type)
                uni.showToast({ title: e3, icon: "none" });
              else {
                if ("modal" !== i2.type)
                  throw new Error(`Invalid errorOptions.type: ${i2.type}`);
                {
                  const { confirm: t3 } = await async function({ title: e4, content: t4, showCancel: n4, cancelText: s5, confirmText: r3 } = {}) {
                    return new Promise((i3, o3) => {
                      uni.showModal({ title: e4, content: t4, showCancel: n4, cancelText: s5, confirmText: r3, success(e5) {
                        i3(e5);
                      }, fail() {
                        i3({ confirm: false, cancel: true });
                      } });
                    });
                  }({ title: "提示", content: e3, showCancel: i2.retry, cancelText: "取消", confirmText: i2.retry ? "重试" : "确定" });
                  if (i2.retry && t3)
                    return s4(...u2);
                }
              }
            const n3 = new te({ subject: f2, code: g2, message: m2, requestId: h2.requestId });
            throw n3.detail = h2.result, Y(H.RESPONSE, { type: J.CLOUD_OBJECT, content: n3 }), n3;
          }
          return Y(H.RESPONSE, { type: J.CLOUD_OBJECT, content: h2.result }), h2.result;
        }, interceptorName: "callObject", getCallbackArgs: function({ params: e3 } = {}) {
          return { objectName: t2, methodName: c2, params: e3 };
        } });
      } });
    };
  }
  function Bs(e2) {
    return U(Xt.replace("{spaceId}", e2.config.spaceId));
  }
  async function Ws({ openid: e2, callLoginByWeixin: t2 = false } = {}) {
    Bs(this);
    throw new Error(`[SecureNetwork] API \`initSecureNetworkByWeixin\` is not supported on platform \`${C}\``);
  }
  async function Hs(e2) {
    const t2 = Bs(this);
    return t2.initPromise || (t2.initPromise = Ws.call(this, e2).then((e3) => e3).catch((e3) => {
      throw delete t2.initPromise, e3;
    })), t2.initPromise;
  }
  function Js(e2) {
    return function({ openid: t2, callLoginByWeixin: n2 = false } = {}) {
      return Hs.call(e2, { openid: t2, callLoginByWeixin: n2 });
    };
  }
  function zs(e2) {
    !function(e3) {
      he = e3;
    }(e2);
  }
  function Vs(e2) {
    const t2 = { getSystemInfo: uni.getSystemInfo, getPushClientId: uni.getPushClientId };
    return function(n2) {
      return new Promise((s2, r2) => {
        t2[e2]({ ...n2, success(e3) {
          s2(e3);
        }, fail(e3) {
          r2(e3);
        } });
      });
    };
  }
  class Gs extends S {
    constructor() {
      super(), this._uniPushMessageCallback = this._receivePushMessage.bind(this), this._currentMessageId = -1, this._payloadQueue = [];
    }
    init() {
      return Promise.all([Vs("getSystemInfo")(), Vs("getPushClientId")()]).then(([{ appId: e2 } = {}, { cid: t2 } = {}] = []) => {
        if (!e2)
          throw new Error("Invalid appId, please check the manifest.json file");
        if (!t2)
          throw new Error("Invalid push client id");
        this._appId = e2, this._pushClientId = t2, this._seqId = Date.now() + "-" + Math.floor(9e5 * Math.random() + 1e5), this.emit("open"), this._initMessageListener();
      }, (e2) => {
        throw this.emit("error", e2), this.close(), e2;
      });
    }
    async open() {
      return this.init();
    }
    _isUniCloudSSE(e2) {
      if ("receive" !== e2.type)
        return false;
      const t2 = e2 && e2.data && e2.data.payload;
      return !(!t2 || "UNI_CLOUD_SSE" !== t2.channel || t2.seqId !== this._seqId);
    }
    _receivePushMessage(e2) {
      if (!this._isUniCloudSSE(e2))
        return;
      const t2 = e2 && e2.data && e2.data.payload, { action: n2, messageId: s2, message: r2 } = t2;
      this._payloadQueue.push({ action: n2, messageId: s2, message: r2 }), this._consumMessage();
    }
    _consumMessage() {
      for (; ; ) {
        const e2 = this._payloadQueue.find((e3) => e3.messageId === this._currentMessageId + 1);
        if (!e2)
          break;
        this._currentMessageId++, this._parseMessagePayload(e2);
      }
    }
    _parseMessagePayload(e2) {
      const { action: t2, messageId: n2, message: s2 } = e2;
      "end" === t2 ? this._end({ messageId: n2, message: s2 }) : "message" === t2 && this._appendMessage({ messageId: n2, message: s2 });
    }
    _appendMessage({ messageId: e2, message: t2 } = {}) {
      this.emit("message", t2);
    }
    _end({ messageId: e2, message: t2 } = {}) {
      this.emit("end", t2), this.close();
    }
    _initMessageListener() {
      uni.onPushMessage(this._uniPushMessageCallback);
    }
    _destroy() {
      uni.offPushMessage(this._uniPushMessageCallback);
    }
    toJSON() {
      return { appId: this._appId, pushClientId: this._pushClientId, seqId: this._seqId };
    }
    close() {
      this._destroy(), this.emit("close");
    }
  }
  async function Ys(e2) {
    {
      const { osName: e3, osVersion: t3 } = ce();
      "ios" === e3 && function(e4) {
        if (!e4 || "string" != typeof e4)
          return 0;
        const t4 = e4.match(/^(\d+)./);
        return t4 && t4[1] ? parseInt(t4[1]) : 0;
      }(t3) >= 14 && console.warn("iOS 14及以上版本连接uniCloud本地调试服务需要允许客户端查找并连接到本地网络上的设备（仅开发期间需要，发行后不需要）");
    }
    const t2 = e2.__dev__;
    if (!t2.debugInfo)
      return;
    const { address: n2, servePort: s2 } = t2.debugInfo, { address: r2 } = await Ot(n2, s2);
    if (r2)
      return t2.localAddress = r2, void (t2.localPort = s2);
    const i2 = console["error"];
    let o2 = "";
    if ("remote" === t2.debugInfo.initialLaunchType ? (t2.debugInfo.forceRemote = true, o2 = "当前客户端和HBuilderX不在同一局域网下（或其他网络原因无法连接HBuilderX），uniCloud本地调试服务不对当前客户端生效。\n- 如果不使用uniCloud本地调试服务，请直接忽略此信息。\n- 如需使用uniCloud本地调试服务，请将客户端与主机连接到同一局域网下并重新运行到客户端。") : o2 = "无法连接uniCloud本地调试服务，请检查当前客户端是否与主机在同一局域网下。\n- 如需使用uniCloud本地调试服务，请将客户端与主机连接到同一局域网下并重新运行到客户端。", o2 += "\n- 如果在HBuilderX开启的状态下切换过网络环境，请重启HBuilderX后再试\n- 检查系统防火墙是否拦截了HBuilderX自带的nodejs\n- 检查是否错误的使用拦截器修改uni.request方法的参数", 0 === C.indexOf("mp-") && (o2 += "\n- 小程序中如何使用uniCloud，请参考：https://uniapp.dcloud.net.cn/uniCloud/publish.html#useinmp"), !t2.debugInfo.forceRemote)
      throw new Error(o2);
    i2(o2);
  }
  function Qs(e2) {
    e2._initPromiseHub || (e2._initPromiseHub = new I({ createPromise: function() {
      let t2 = Promise.resolve();
      var n2;
      n2 = 1, t2 = new Promise((e3) => {
        setTimeout(() => {
          e3();
        }, n2);
      });
      const s2 = e2.auth();
      return t2.then(() => s2.getLoginState()).then((e3) => e3 ? Promise.resolve() : s2.signInAnonymously());
    } }));
  }
  const Xs = { tcb: Ct, tencent: Ct, aliyun: fe, private: Rt, dcloud: Rt, alipay: Bt };
  let Zs = new class {
    init(e2) {
      let t2 = {};
      const n2 = Xs[e2.provider];
      if (!n2)
        throw new Error("未提供正确的provider参数");
      t2 = n2.init(e2), function(e3) {
        const t3 = {};
        e3.__dev__ = t3, t3.debugLog = "app" === C;
        const n3 = A;
        n3 && !n3.code && (t3.debugInfo = n3);
        const s2 = new I({ createPromise: function() {
          return Ys(e3);
        } });
        t3.initLocalNetwork = function() {
          return s2.exec();
        };
      }(t2), Qs(t2), Gn(t2), function(e3) {
        const t3 = e3.uploadFile;
        e3.uploadFile = function(e4) {
          return t3.call(this, e4);
        };
      }(t2), function(e3) {
        e3.database = function(t3) {
          if (t3 && Object.keys(t3).length > 0)
            return e3.init(t3).database();
          if (this._database)
            return this._database;
          const n3 = as(cs, { uniClient: e3 });
          return this._database = n3, n3;
        }, e3.databaseForJQL = function(t3) {
          if (t3 && Object.keys(t3).length > 0)
            return e3.init(t3).databaseForJQL();
          if (this._databaseForJQL)
            return this._databaseForJQL;
          const n3 = as(cs, { uniClient: e3, isJQL: true });
          return this._databaseForJQL = n3, n3;
        };
      }(t2), function(e3) {
        e3.getCurrentUserInfo = Ms, e3.chooseAndUploadFile = Fs.initChooseAndUploadFile(e3), Object.assign(e3, { get mixinDatacom() {
          return js(e3);
        } }), e3.SSEChannel = Gs, e3.initSecureNetworkByWeixin = Js(e3), e3.setCustomClientInfo = zs, e3.importObject = $s(e3);
      }(t2);
      return ["callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "chooseAndUploadFile"].forEach((e3) => {
        if (!t2[e3])
          return;
        const n3 = t2[e3];
        t2[e3] = function() {
          return n3.apply(t2, Array.from(arguments));
        }, t2[e3] = (/* @__PURE__ */ function(e4, t3) {
          return function(n4) {
            let s2 = false;
            if ("callFunction" === t3) {
              const e5 = n4 && n4.type || l.DEFAULT;
              s2 = e5 !== l.DEFAULT;
            }
            const r2 = "callFunction" === t3 && !s2, i2 = this._initPromiseHub.exec();
            n4 = n4 || {};
            const { success: o2, fail: a2, complete: c2 } = ee(n4), u2 = i2.then(() => s2 ? Promise.resolve() : j($(t3, "invoke"), n4)).then(() => e4.call(this, n4)).then((e5) => s2 ? Promise.resolve(e5) : j($(t3, "success"), e5).then(() => j($(t3, "complete"), e5)).then(() => (r2 && Y(H.RESPONSE, { type: J.CLOUD_FUNCTION, content: e5 }), Promise.resolve(e5))), (e5) => s2 ? Promise.reject(e5) : j($(t3, "fail"), e5).then(() => j($(t3, "complete"), e5)).then(() => (Y(H.RESPONSE, { type: J.CLOUD_FUNCTION, content: e5 }), Promise.reject(e5))));
            if (!(o2 || a2 || c2))
              return u2;
            u2.then((e5) => {
              o2 && o2(e5), c2 && c2(e5), r2 && Y(H.RESPONSE, { type: J.CLOUD_FUNCTION, content: e5 });
            }, (e5) => {
              a2 && a2(e5), c2 && c2(e5), r2 && Y(H.RESPONSE, { type: J.CLOUD_FUNCTION, content: e5 });
            });
          };
        }(t2[e3], e3)).bind(t2);
      }), t2.init = this.init, t2;
    }
  }();
  (() => {
    const e2 = O;
    let t2 = {};
    if (e2 && 1 === e2.length)
      t2 = e2[0], Zs = Zs.init(t2), Zs._isDefault = true;
    else {
      const t3 = ["auth", "callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "database", "getCurrentUSerInfo", "importObject"];
      let n2;
      n2 = e2 && e2.length > 0 ? "应用有多个服务空间，请通过uniCloud.init方法指定要使用的服务空间" : "应用未关联服务空间，请在uniCloud目录右键关联服务空间", t3.forEach((e3) => {
        Zs[e3] = function() {
          return console.error(n2), Promise.reject(new te({ code: "SYS_ERR", message: n2 }));
        };
      });
    }
    if (Object.assign(Zs, { get mixinDatacom() {
      return js(Zs);
    } }), Rs(Zs), Zs.addInterceptor = F, Zs.removeInterceptor = K, Zs.interceptObject = B, uni.__uniCloud = Zs, "app" === C) {
      const e3 = D();
      e3.uniCloud = Zs, e3.UniCloudError = te;
    }
  })();
  var er = Zs;
  const _sfc_main$g = {
    name: "loading1",
    data() {
      return {};
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container loading1" }, [
      vue.createElementVNode("view", { class: "shape shape1" }),
      vue.createElementVNode("view", { class: "shape shape2" }),
      vue.createElementVNode("view", { class: "shape shape3" }),
      vue.createElementVNode("view", { class: "shape shape4" })
    ]);
  }
  const Loading1 = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__scopeId", "data-v-0e645258"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/uni_modules/qiun-data-charts/components/qiun-loading/loading1.vue"]]);
  const _sfc_main$f = {
    name: "loading2",
    data() {
      return {};
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container loading2" }, [
      vue.createElementVNode("view", { class: "shape shape1" }),
      vue.createElementVNode("view", { class: "shape shape2" }),
      vue.createElementVNode("view", { class: "shape shape3" }),
      vue.createElementVNode("view", { class: "shape shape4" })
    ]);
  }
  const Loading2 = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__scopeId", "data-v-3df48dc2"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/uni_modules/qiun-data-charts/components/qiun-loading/loading2.vue"]]);
  const _sfc_main$e = {
    name: "loading3",
    data() {
      return {};
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container loading3" }, [
      vue.createElementVNode("view", { class: "shape shape1" }),
      vue.createElementVNode("view", { class: "shape shape2" }),
      vue.createElementVNode("view", { class: "shape shape3" }),
      vue.createElementVNode("view", { class: "shape shape4" })
    ]);
  }
  const Loading3 = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-27a8293c"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/uni_modules/qiun-data-charts/components/qiun-loading/loading3.vue"]]);
  const _sfc_main$d = {
    name: "loading5",
    data() {
      return {};
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container loading5" }, [
      vue.createElementVNode("view", { class: "shape shape1" }),
      vue.createElementVNode("view", { class: "shape shape2" }),
      vue.createElementVNode("view", { class: "shape shape3" }),
      vue.createElementVNode("view", { class: "shape shape4" })
    ]);
  }
  const Loading4 = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-2e7deb83"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/uni_modules/qiun-data-charts/components/qiun-loading/loading4.vue"]]);
  const _sfc_main$c = {
    name: "loading6",
    data() {
      return {};
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container loading6" }, [
      vue.createElementVNode("view", { class: "shape shape1" }),
      vue.createElementVNode("view", { class: "shape shape2" }),
      vue.createElementVNode("view", { class: "shape shape3" }),
      vue.createElementVNode("view", { class: "shape shape4" })
    ]);
  }
  const Loading5 = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-ef674bbb"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/uni_modules/qiun-data-charts/components/qiun-loading/loading5.vue"]]);
  const _sfc_main$b = {
    components: { Loading1, Loading2, Loading3, Loading4, Loading5 },
    name: "qiun-loading",
    props: {
      loadingType: {
        type: Number,
        default: 2
      }
    },
    data() {
      return {};
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Loading1 = vue.resolveComponent("Loading1");
    const _component_Loading2 = vue.resolveComponent("Loading2");
    const _component_Loading3 = vue.resolveComponent("Loading3");
    const _component_Loading4 = vue.resolveComponent("Loading4");
    const _component_Loading5 = vue.resolveComponent("Loading5");
    return vue.openBlock(), vue.createElementBlock("view", null, [
      $props.loadingType == 1 ? (vue.openBlock(), vue.createBlock(_component_Loading1, { key: 0 })) : vue.createCommentVNode("v-if", true),
      $props.loadingType == 2 ? (vue.openBlock(), vue.createBlock(_component_Loading2, { key: 1 })) : vue.createCommentVNode("v-if", true),
      $props.loadingType == 3 ? (vue.openBlock(), vue.createBlock(_component_Loading3, { key: 2 })) : vue.createCommentVNode("v-if", true),
      $props.loadingType == 4 ? (vue.openBlock(), vue.createBlock(_component_Loading4, { key: 3 })) : vue.createCommentVNode("v-if", true),
      $props.loadingType == 5 ? (vue.openBlock(), vue.createBlock(_component_Loading5, { key: 4 })) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/uni_modules/qiun-data-charts/components/qiun-loading/qiun-loading.vue"]]);
  const _sfc_main$a = {
    name: "qiun-error",
    props: {
      errorMessage: {
        type: String,
        default: null
      }
    },
    data() {
      return {};
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "chartsview" }, [
      vue.createElementVNode("view", { class: "charts-error" }),
      vue.createElementVNode(
        "view",
        { class: "charts-font" },
        vue.toDisplayString($props.errorMessage == null ? "请点击重试" : $props.errorMessage),
        1
        /* TEXT */
      )
    ]);
  }
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-a99d579b"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/uni_modules/qiun-data-charts/components/qiun-error/qiun-error.vue"]]);
  const color$2 = ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"];
  const formatDateTime = (timeStamp, returnType) => {
    var date2 = /* @__PURE__ */ new Date();
    date2.setTime(timeStamp * 1e3);
    var y2 = date2.getFullYear();
    var m2 = date2.getMonth() + 1;
    m2 = m2 < 10 ? "0" + m2 : m2;
    var d2 = date2.getDate();
    d2 = d2 < 10 ? "0" + d2 : d2;
    var h2 = date2.getHours();
    h2 = h2 < 10 ? "0" + h2 : h2;
    var minute = date2.getMinutes();
    var second = date2.getSeconds();
    minute = minute < 10 ? "0" + minute : minute;
    second = second < 10 ? "0" + second : second;
    if (returnType == "full") {
      return y2 + "-" + m2 + "-" + d2 + " " + h2 + ":" + minute + ":" + second;
    }
    if (returnType == "y-m-d") {
      return y2 + "-" + m2 + "-" + d2;
    }
    if (returnType == "h:m") {
      return h2 + ":" + minute;
    }
    if (returnType == "h:m:s") {
      return h2 + ":" + minute + ":" + second;
    }
    return [y2, m2, d2, h2, minute, second];
  };
  const cfu = {
    //demotype为自定义图表类型，一般不需要自定义图表类型，只需要改根节点上对应的类型即可
    "type": ["pie", "ring", "rose", "word", "funnel", "map", "arcbar", "line", "column", "mount", "bar", "area", "radar", "gauge", "candle", "mix", "tline", "tarea", "scatter", "bubble", "demotype"],
    "range": ["饼状图", "圆环图", "玫瑰图", "词云图", "漏斗图", "地图", "圆弧进度条", "折线图", "柱状图", "山峰图", "条状图", "区域图", "雷达图", "仪表盘", "K线图", "混合图", "时间轴折线", "时间轴区域", "散点图", "气泡图", "自定义类型"],
    //增加自定义图表类型，如果需要categories，请在这里加入您的图表类型，例如最后的"demotype"
    //自定义类型时需要注意"tline","tarea","scatter","bubble"等时间轴（矢量x轴）类图表，没有categories，不需要加入categories
    "categories": ["line", "column", "mount", "bar", "area", "radar", "gauge", "candle", "mix", "demotype"],
    //instance为实例变量承载属性，不要删除
    "instance": {},
    //option为opts及eopts承载属性，不要删除
    "option": {},
    //下面是自定义format配置，因除H5端外的其他端无法通过props传递函数，只能通过此属性对应下标的方式来替换
    "formatter": {
      "yAxisFix1": function(val, index, opts) {
        return val.toFixed(1);
      },
      "yAxisFix2": function(val, index, opts) {
        return val.toFixed(2);
      },
      "yAxisFix3": function(val, index, opts) {
        return val.toFixed(3);
      },
      "yAxisFix4": function(val, index, opts) {
        return val.toFixed(4);
      },
      "yAxisFix5": function(val, index, opts) {
        return val.toFixed(5);
      },
      "yAxisDemo1": function(val, index, opts) {
        return val + "元";
      },
      "yAxisDemo2": function(val, index, opts) {
        return val.toFixed(2);
      },
      "xAxisDemo1": function(val, index, opts) {
        return val + "年";
      },
      "xAxisDemo2": function(val, index, opts) {
        return formatDateTime(val, "h:m");
      },
      "seriesDemo1": function(val, index, series, opts) {
        return val + "元";
      },
      "tooltipDemo1": function(item, category, index, opts) {
        if (index == 0) {
          return "随便用" + item.data + "年";
        } else {
          return "其他我没改" + item.data + "天";
        }
      },
      "pieDemo": function(val, index, series, opts) {
        if (index !== void 0) {
          return series[index].name + "：" + series[index].data + "元";
        }
      }
    },
    //这里演示了自定义您的图表类型的option，可以随意命名，之后在组件上 type="demotype" 后，组件会调用这个花括号里的option，如果组件上还存在opts参数，会将demotype与opts中option合并后渲染图表。
    "demotype": {
      //我这里把曲线图当做了自定义图表类型，您可以根据需要随意指定类型或配置
      "type": "line",
      "color": color$2,
      "padding": [15, 10, 0, 15],
      "xAxis": {
        "disableGrid": true
      },
      "yAxis": {
        "gridType": "dash",
        "dashLength": 2
      },
      "legend": {},
      "extra": {
        "line": {
          "type": "curve",
          "width": 2
        }
      }
    },
    //下面是自定义配置，请添加项目所需的通用配置
    "pie": {
      "type": "pie",
      "color": color$2,
      "padding": [5, 5, 5, 5],
      "extra": {
        "pie": {
          "activeOpacity": 0.5,
          "activeRadius": 10,
          "offsetAngle": 0,
          "labelWidth": 15,
          "border": true,
          "borderWidth": 3,
          "borderColor": "#FFFFFF"
        }
      }
    },
    "ring": {
      "type": "ring",
      "color": color$2,
      "padding": [5, 5, 5, 5],
      "rotate": false,
      "dataLabel": true,
      "legend": {
        "show": true,
        "position": "right",
        "lineHeight": 25
      },
      "title": {
        "name": "收益率",
        "fontSize": 15,
        "color": "#666666"
      },
      "subtitle": {
        "name": "70%",
        "fontSize": 25,
        "color": "#7cb5ec"
      },
      "extra": {
        "ring": {
          "ringWidth": 30,
          "activeOpacity": 0.5,
          "activeRadius": 10,
          "offsetAngle": 0,
          "labelWidth": 15,
          "border": true,
          "borderWidth": 3,
          "borderColor": "#FFFFFF"
        }
      }
    },
    "rose": {
      "type": "rose",
      "color": color$2,
      "padding": [5, 5, 5, 5],
      "legend": {
        "show": true,
        "position": "left",
        "lineHeight": 25
      },
      "extra": {
        "rose": {
          "type": "area",
          "minRadius": 50,
          "activeOpacity": 0.5,
          "activeRadius": 10,
          "offsetAngle": 0,
          "labelWidth": 15,
          "border": false,
          "borderWidth": 2,
          "borderColor": "#FFFFFF"
        }
      }
    },
    "word": {
      "type": "word",
      "color": color$2,
      "extra": {
        "word": {
          "type": "normal",
          "autoColors": false
        }
      }
    },
    "funnel": {
      "type": "funnel",
      "color": color$2,
      "padding": [15, 15, 0, 15],
      "extra": {
        "funnel": {
          "activeOpacity": 0.3,
          "activeWidth": 10,
          "border": true,
          "borderWidth": 2,
          "borderColor": "#FFFFFF",
          "fillOpacity": 1,
          "labelAlign": "right"
        }
      }
    },
    "map": {
      "type": "map",
      "color": color$2,
      "padding": [0, 0, 0, 0],
      "dataLabel": true,
      "extra": {
        "map": {
          "border": true,
          "borderWidth": 1,
          "borderColor": "#666666",
          "fillOpacity": 0.6,
          "activeBorderColor": "#F04864",
          "activeFillColor": "#FACC14",
          "activeFillOpacity": 1
        }
      }
    },
    "arcbar": {
      "type": "arcbar",
      "color": color$2,
      "title": {
        "name": "百分比",
        "fontSize": 25,
        "color": "#00FF00"
      },
      "subtitle": {
        "name": "默认标题",
        "fontSize": 15,
        "color": "#666666"
      },
      "extra": {
        "arcbar": {
          "type": "default",
          "width": 12,
          "backgroundColor": "#E9E9E9",
          "startAngle": 0.75,
          "endAngle": 0.25,
          "gap": 2
        }
      }
    },
    "line": {
      "type": "line",
      "color": color$2,
      "padding": [15, 10, 0, 15],
      "xAxis": {
        "disableGrid": true
      },
      "yAxis": {
        "gridType": "dash",
        "dashLength": 2
      },
      "legend": {},
      "extra": {
        "line": {
          "type": "straight",
          "width": 2,
          "activeType": "hollow"
        }
      }
    },
    "tline": {
      "type": "line",
      "color": color$2,
      "padding": [15, 10, 0, 15],
      "xAxis": {
        "disableGrid": false,
        "boundaryGap": "justify"
      },
      "yAxis": {
        "gridType": "dash",
        "dashLength": 2,
        "data": [
          {
            "min": 0,
            "max": 80
          }
        ]
      },
      "legend": {},
      "extra": {
        "line": {
          "type": "curve",
          "width": 2,
          "activeType": "hollow"
        }
      }
    },
    "tarea": {
      "type": "area",
      "color": color$2,
      "padding": [15, 10, 0, 15],
      "xAxis": {
        "disableGrid": true,
        "boundaryGap": "justify"
      },
      "yAxis": {
        "gridType": "dash",
        "dashLength": 2,
        "data": [
          {
            "min": 0,
            "max": 80
          }
        ]
      },
      "legend": {},
      "extra": {
        "area": {
          "type": "curve",
          "opacity": 0.2,
          "addLine": true,
          "width": 2,
          "gradient": true,
          "activeType": "hollow"
        }
      }
    },
    "column": {
      "type": "column",
      "color": color$2,
      "padding": [15, 15, 0, 5],
      "xAxis": {
        "disableGrid": true
      },
      "yAxis": {
        "data": [{ "min": 0 }]
      },
      "legend": {},
      "extra": {
        "column": {
          "type": "group",
          "width": 30,
          "activeBgColor": "#000000",
          "activeBgOpacity": 0.08
        }
      }
    },
    "mount": {
      "type": "mount",
      "color": color$2,
      "padding": [15, 15, 0, 5],
      "xAxis": {
        "disableGrid": true
      },
      "yAxis": {
        "data": [{ "min": 0 }]
      },
      "legend": {},
      "extra": {
        "mount": {
          "type": "mount",
          "widthRatio": 1.5
        }
      }
    },
    "bar": {
      "type": "bar",
      "color": color$2,
      "padding": [15, 30, 0, 5],
      "xAxis": {
        "boundaryGap": "justify",
        "disableGrid": false,
        "min": 0,
        "axisLine": false
      },
      "yAxis": {},
      "legend": {},
      "extra": {
        "bar": {
          "type": "group",
          "width": 30,
          "meterBorde": 1,
          "meterFillColor": "#FFFFFF",
          "activeBgColor": "#000000",
          "activeBgOpacity": 0.08
        }
      }
    },
    "area": {
      "type": "area",
      "color": color$2,
      "padding": [15, 15, 0, 15],
      "xAxis": {
        "disableGrid": true
      },
      "yAxis": {
        "gridType": "dash",
        "dashLength": 2
      },
      "legend": {},
      "extra": {
        "area": {
          "type": "straight",
          "opacity": 0.2,
          "addLine": true,
          "width": 2,
          "gradient": false,
          "activeType": "hollow"
        }
      }
    },
    "radar": {
      "type": "radar",
      "color": color$2,
      "padding": [5, 5, 5, 5],
      "dataLabel": false,
      "legend": {
        "show": true,
        "position": "right",
        "lineHeight": 25
      },
      "extra": {
        "radar": {
          "gridType": "radar",
          "gridColor": "#CCCCCC",
          "gridCount": 3,
          "opacity": 0.2,
          "max": 200,
          "labelShow": true
        }
      }
    },
    "gauge": {
      "type": "gauge",
      "color": color$2,
      "title": {
        "name": "66Km/H",
        "fontSize": 25,
        "color": "#2fc25b",
        "offsetY": 50
      },
      "subtitle": {
        "name": "实时速度",
        "fontSize": 15,
        "color": "#1890ff",
        "offsetY": -50
      },
      "extra": {
        "gauge": {
          "type": "default",
          "width": 30,
          "labelColor": "#666666",
          "startAngle": 0.75,
          "endAngle": 0.25,
          "startNumber": 0,
          "endNumber": 100,
          "labelFormat": "",
          "splitLine": {
            "fixRadius": 0,
            "splitNumber": 10,
            "width": 30,
            "color": "#FFFFFF",
            "childNumber": 5,
            "childWidth": 12
          },
          "pointer": {
            "width": 24,
            "color": "auto"
          }
        }
      }
    },
    "candle": {
      "type": "candle",
      "color": color$2,
      "padding": [15, 15, 0, 15],
      "enableScroll": true,
      "enableMarkLine": true,
      "dataLabel": false,
      "xAxis": {
        "labelCount": 4,
        "itemCount": 40,
        "disableGrid": true,
        "gridColor": "#CCCCCC",
        "gridType": "solid",
        "dashLength": 4,
        "scrollShow": true,
        "scrollAlign": "left",
        "scrollColor": "#A6A6A6",
        "scrollBackgroundColor": "#EFEBEF"
      },
      "yAxis": {},
      "legend": {},
      "extra": {
        "candle": {
          "color": {
            "upLine": "#f04864",
            "upFill": "#f04864",
            "downLine": "#2fc25b",
            "downFill": "#2fc25b"
          },
          "average": {
            "show": true,
            "name": ["MA5", "MA10", "MA30"],
            "day": [5, 10, 20],
            "color": ["#1890ff", "#2fc25b", "#facc14"]
          }
        },
        "markLine": {
          "type": "dash",
          "dashLength": 5,
          "data": [
            {
              "value": 2150,
              "lineColor": "#f04864",
              "showLabel": true
            },
            {
              "value": 2350,
              "lineColor": "#f04864",
              "showLabel": true
            }
          ]
        }
      }
    },
    "mix": {
      "type": "mix",
      "color": color$2,
      "padding": [15, 15, 0, 15],
      "xAxis": {
        "disableGrid": true
      },
      "yAxis": {
        "disabled": false,
        "disableGrid": false,
        "splitNumber": 5,
        "gridType": "dash",
        "dashLength": 4,
        "gridColor": "#CCCCCC",
        "padding": 10,
        "showTitle": true,
        "data": []
      },
      "legend": {},
      "extra": {
        "mix": {
          "column": {
            "width": 20
          }
        }
      }
    },
    "scatter": {
      "type": "scatter",
      "color": color$2,
      "padding": [15, 15, 0, 15],
      "dataLabel": false,
      "xAxis": {
        "disableGrid": false,
        "gridType": "dash",
        "splitNumber": 5,
        "boundaryGap": "justify",
        "min": 0
      },
      "yAxis": {
        "disableGrid": false,
        "gridType": "dash"
      },
      "legend": {},
      "extra": {
        "scatter": {}
      }
    },
    "bubble": {
      "type": "bubble",
      "color": color$2,
      "padding": [15, 15, 0, 15],
      "xAxis": {
        "disableGrid": false,
        "gridType": "dash",
        "splitNumber": 5,
        "boundaryGap": "justify",
        "min": 0,
        "max": 250
      },
      "yAxis": {
        "disableGrid": false,
        "gridType": "dash",
        "data": [{
          "min": 0,
          "max": 150
        }]
      },
      "legend": {},
      "extra": {
        "bubble": {
          "border": 2,
          "opacity": 0.5
        }
      }
    }
  };
  const color$1 = ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"];
  const cfe = {
    //demotype为自定义图表类型
    "type": ["pie", "ring", "rose", "funnel", "line", "column", "area", "radar", "gauge", "candle", "demotype"],
    //增加自定义图表类型，如果需要categories，请在这里加入您的图表类型例如最后的"demotype"
    "categories": ["line", "column", "area", "radar", "gauge", "candle", "demotype"],
    //instance为实例变量承载属性，option为eopts承载属性，不要删除
    "instance": {},
    "option": {},
    //下面是自定义format配置，因除H5端外的其他端无法通过props传递函数，只能通过此属性对应下标的方式来替换
    "formatter": {
      "tooltipDemo1": function(res) {
        let result = "";
        for (let i2 in res) {
          if (i2 == 0) {
            result += res[i2].axisValueLabel + "年销售额";
          }
          let value = "--";
          if (res[i2].data !== null) {
            value = res[i2].data;
          }
          result += "<br/>" + res[i2].marker + res[i2].seriesName + "：" + value + " 万元";
        }
        return result;
      },
      legendFormat: function(name) {
        return "自定义图例+" + name;
      },
      yAxisFormatDemo: function(value, index) {
        return value + "元";
      },
      seriesFormatDemo: function(res) {
        return res.name + "年" + res.value + "元";
      }
    },
    //这里演示了自定义您的图表类型的option，可以随意命名，之后在组件上 type="demotype" 后，组件会调用这个花括号里的option，如果组件上还存在eopts参数，会将demotype与eopts中option合并后渲染图表。
    "demotype": {
      "color": color$1
      //在这里填写echarts的option即可
    },
    //下面是自定义配置，请添加项目所需的通用配置
    "column": {
      "color": color$1,
      "title": {
        "text": ""
      },
      "tooltip": {
        "trigger": "axis"
      },
      "grid": {
        "top": 30,
        "bottom": 50,
        "right": 15,
        "left": 40
      },
      "legend": {
        "bottom": "left"
      },
      "toolbox": {
        "show": false
      },
      "xAxis": {
        "type": "category",
        "axisLabel": {
          "color": "#666666"
        },
        "axisLine": {
          "lineStyle": {
            "color": "#CCCCCC"
          }
        },
        "boundaryGap": true,
        "data": []
      },
      "yAxis": {
        "type": "value",
        "axisTick": {
          "show": false
        },
        "axisLabel": {
          "color": "#666666"
        },
        "axisLine": {
          "lineStyle": {
            "color": "#CCCCCC"
          }
        }
      },
      "seriesTemplate": {
        "name": "",
        "type": "bar",
        "data": [],
        "barwidth": 20,
        "label": {
          "show": true,
          "color": "#666666",
          "position": "top"
        }
      }
    },
    "line": {
      "color": color$1,
      "title": {
        "text": ""
      },
      "tooltip": {
        "trigger": "axis"
      },
      "grid": {
        "top": 30,
        "bottom": 50,
        "right": 15,
        "left": 40
      },
      "legend": {
        "bottom": "left"
      },
      "toolbox": {
        "show": false
      },
      "xAxis": {
        "type": "category",
        "axisLabel": {
          "color": "#666666"
        },
        "axisLine": {
          "lineStyle": {
            "color": "#CCCCCC"
          }
        },
        "boundaryGap": true,
        "data": []
      },
      "yAxis": {
        "type": "value",
        "axisTick": {
          "show": false
        },
        "axisLabel": {
          "color": "#666666"
        },
        "axisLine": {
          "lineStyle": {
            "color": "#CCCCCC"
          }
        }
      },
      "seriesTemplate": {
        "name": "",
        "type": "line",
        "data": [],
        "barwidth": 20,
        "label": {
          "show": true,
          "color": "#666666",
          "position": "top"
        }
      }
    },
    "area": {
      "color": color$1,
      "title": {
        "text": ""
      },
      "tooltip": {
        "trigger": "axis"
      },
      "grid": {
        "top": 30,
        "bottom": 50,
        "right": 15,
        "left": 40
      },
      "legend": {
        "bottom": "left"
      },
      "toolbox": {
        "show": false
      },
      "xAxis": {
        "type": "category",
        "axisLabel": {
          "color": "#666666"
        },
        "axisLine": {
          "lineStyle": {
            "color": "#CCCCCC"
          }
        },
        "boundaryGap": true,
        "data": []
      },
      "yAxis": {
        "type": "value",
        "axisTick": {
          "show": false
        },
        "axisLabel": {
          "color": "#666666"
        },
        "axisLine": {
          "lineStyle": {
            "color": "#CCCCCC"
          }
        }
      },
      "seriesTemplate": {
        "name": "",
        "type": "line",
        "data": [],
        "areaStyle": {},
        "label": {
          "show": true,
          "color": "#666666",
          "position": "top"
        }
      }
    },
    "pie": {
      "color": color$1,
      "title": {
        "text": ""
      },
      "tooltip": {
        "trigger": "item"
      },
      "grid": {
        "top": 40,
        "bottom": 30,
        "right": 15,
        "left": 15
      },
      "legend": {
        "bottom": "left"
      },
      "seriesTemplate": {
        "name": "",
        "type": "pie",
        "data": [],
        "radius": "50%",
        "label": {
          "show": true,
          "color": "#666666",
          "position": "top"
        }
      }
    },
    "ring": {
      "color": color$1,
      "title": {
        "text": ""
      },
      "tooltip": {
        "trigger": "item"
      },
      "grid": {
        "top": 40,
        "bottom": 30,
        "right": 15,
        "left": 15
      },
      "legend": {
        "bottom": "left"
      },
      "seriesTemplate": {
        "name": "",
        "type": "pie",
        "data": [],
        "radius": ["40%", "70%"],
        "avoidLabelOverlap": false,
        "label": {
          "show": true,
          "color": "#666666",
          "position": "top"
        },
        "labelLine": {
          "show": true
        }
      }
    },
    "rose": {
      "color": color$1,
      "title": {
        "text": ""
      },
      "tooltip": {
        "trigger": "item"
      },
      "legend": {
        "top": "bottom"
      },
      "seriesTemplate": {
        "name": "",
        "type": "pie",
        "data": [],
        "radius": "55%",
        "center": ["50%", "50%"],
        "roseType": "area"
      }
    },
    "funnel": {
      "color": color$1,
      "title": {
        "text": ""
      },
      "tooltip": {
        "trigger": "item",
        "formatter": "{b} : {c}%"
      },
      "legend": {
        "top": "bottom"
      },
      "seriesTemplate": {
        "name": "",
        "type": "funnel",
        "left": "10%",
        "top": 60,
        "bottom": 60,
        "width": "80%",
        "min": 0,
        "max": 100,
        "minSize": "0%",
        "maxSize": "100%",
        "sort": "descending",
        "gap": 2,
        "label": {
          "show": true,
          "position": "inside"
        },
        "labelLine": {
          "length": 10,
          "lineStyle": {
            "width": 1,
            "type": "solid"
          }
        },
        "itemStyle": {
          "bordercolor": "#fff",
          "borderwidth": 1
        },
        "emphasis": {
          "label": {
            "fontSize": 20
          }
        },
        "data": []
      }
    },
    "gauge": {
      "color": color$1,
      "tooltip": {
        "formatter": "{a} <br/>{b} : {c}%"
      },
      "seriesTemplate": {
        "name": "业务指标",
        "type": "gauge",
        "detail": { "formatter": "{value}%" },
        "data": [{ "value": 50, "name": "完成率" }]
      }
    },
    "candle": {
      "xAxis": {
        "data": []
      },
      "yAxis": {},
      "color": color$1,
      "title": {
        "text": ""
      },
      "dataZoom": [
        {
          "type": "inside",
          "xAxisIndex": [0, 1],
          "start": 10,
          "end": 100
        },
        {
          "show": true,
          "xAxisIndex": [0, 1],
          "type": "slider",
          "bottom": 10,
          "start": 10,
          "end": 100
        }
      ],
      "seriesTemplate": {
        "name": "",
        "type": "k",
        "data": []
      }
    }
  };
  const block0 = (Comp) => {
    (Comp.$renderjs || (Comp.$renderjs = [])).push("rdcharts");
    (Comp.$renderjsModules || (Comp.$renderjsModules = {}))["rdcharts"] = "f9cb76fc";
  };
  function deepCloneAssign(origin = {}, ...args) {
    for (let i2 in args) {
      for (let key in args[i2]) {
        if (args[i2].hasOwnProperty(key)) {
          origin[key] = args[i2][key] && typeof args[i2][key] === "object" ? deepCloneAssign(Array.isArray(args[i2][key]) ? [] : {}, origin[key], args[i2][key]) : args[i2][key];
        }
      }
    }
    return origin;
  }
  function formatterAssign(args, formatter) {
    for (let key in args) {
      if (args.hasOwnProperty(key) && args[key] !== null && typeof args[key] === "object") {
        formatterAssign(args[key], formatter);
      } else if (key === "format" && typeof args[key] === "string") {
        args["formatter"] = formatter[args[key]] ? formatter[args[key]] : void 0;
      }
    }
    return args;
  }
  function getFormatDate(date2) {
    var seperator = "-";
    var year = date2.getFullYear();
    var month = date2.getMonth() + 1;
    var strDate = date2.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator + month + seperator + strDate;
    return currentdate;
  }
  const _sfc_main$9 = {
    name: "qiun-data-charts",
    mixins: [er.mixinDatacom],
    props: {
      type: {
        type: String,
        default: null
      },
      canvasId: {
        type: String,
        default: "uchartsid"
      },
      canvas2d: {
        type: Boolean,
        default: false
      },
      background: {
        type: String,
        default: "rgba(0,0,0,0)"
      },
      animation: {
        type: Boolean,
        default: true
      },
      chartData: {
        type: Object,
        default() {
          return {
            categories: [],
            series: []
          };
        }
      },
      opts: {
        type: Object,
        default() {
          return {};
        }
      },
      eopts: {
        type: Object,
        default() {
          return {};
        }
      },
      loadingType: {
        type: Number,
        default: 2
      },
      errorShow: {
        type: Boolean,
        default: true
      },
      errorReload: {
        type: Boolean,
        default: true
      },
      errorMessage: {
        type: String,
        default: null
      },
      inScrollView: {
        type: Boolean,
        default: false
      },
      reshow: {
        type: Boolean,
        default: false
      },
      reload: {
        type: Boolean,
        default: false
      },
      disableScroll: {
        type: Boolean,
        default: false
      },
      optsWatch: {
        type: Boolean,
        default: true
      },
      onzoom: {
        type: Boolean,
        default: false
      },
      ontap: {
        type: Boolean,
        default: true
      },
      ontouch: {
        type: Boolean,
        default: false
      },
      onmouse: {
        type: Boolean,
        default: true
      },
      onmovetip: {
        type: Boolean,
        default: false
      },
      echartsH5: {
        type: Boolean,
        default: false
      },
      echartsApp: {
        type: Boolean,
        default: false
      },
      tooltipShow: {
        type: Boolean,
        default: true
      },
      tooltipFormat: {
        type: String,
        default: void 0
      },
      tooltipCustom: {
        type: Object,
        default: void 0
      },
      startDate: {
        type: String,
        default: void 0
      },
      endDate: {
        type: String,
        default: void 0
      },
      textEnum: {
        type: Array,
        default() {
          return [];
        }
      },
      groupEnum: {
        type: Array,
        default() {
          return [];
        }
      },
      pageScrollTop: {
        type: Number,
        default: 0
      },
      directory: {
        type: String,
        default: "/"
      },
      tapLegend: {
        type: Boolean,
        default: true
      },
      menus: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    data() {
      return {
        cid: "uchartsid",
        inWx: false,
        inAli: false,
        inTt: false,
        inBd: false,
        inH5: false,
        inApp: false,
        inWin: false,
        type2d: true,
        disScroll: false,
        openmouse: false,
        pixel: 1,
        cWidth: 375,
        cHeight: 250,
        showchart: false,
        echarts: false,
        echartsResize: {
          state: false
        },
        uchartsOpts: {},
        echartsOpts: {},
        drawData: {},
        lastDrawTime: null
      };
    },
    created() {
      this.cid = this.canvasId;
      if (this.canvasId == "uchartsid" || this.canvasId == "") {
        let t2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let len = t2.length;
        let id = "";
        for (let i2 = 0; i2 < 32; i2++) {
          id += t2.charAt(Math.floor(Math.random() * len));
        }
        this.cid = id;
      }
      const systemInfo = uni.getSystemInfoSync();
      if (systemInfo.platform === "windows" || systemInfo.platform === "mac") {
        this.inWin = true;
      }
      this.type2d = false;
      this.disScroll = this.disableScroll;
    },
    mounted() {
      this.inApp = true;
      if (this.echartsApp === true) {
        this.echarts = true;
        this.openmouse = false;
      }
      this.$nextTick(() => {
        this.beforeInit();
      });
    },
    destroyed() {
      if (this.echarts === true) {
        delete cfe.option[this.cid];
        delete cfe.instance[this.cid];
      } else {
        delete cfu.option[this.cid];
        delete cfu.instance[this.cid];
      }
      uni.offWindowResize(() => {
      });
    },
    watch: {
      chartDataProps: {
        handler(val, oldval) {
          if (typeof val === "object") {
            if (JSON.stringify(val) !== JSON.stringify(oldval)) {
              this._clearChart();
              if (val.series && val.series.length > 0) {
                this.beforeInit();
              } else {
                this.mixinDatacomLoading = true;
                this.showchart = false;
                this.mixinDatacomErrorMessage = null;
              }
            }
          } else {
            this.mixinDatacomLoading = false;
            this._clearChart();
            this.showchart = false;
            this.mixinDatacomErrorMessage = "参数错误：chartData数据类型错误";
          }
        },
        immediate: false,
        deep: true
      },
      localdata: {
        handler(val, oldval) {
          if (JSON.stringify(val) !== JSON.stringify(oldval)) {
            if (val.length > 0) {
              this.beforeInit();
            } else {
              this.mixinDatacomLoading = true;
              this._clearChart();
              this.showchart = false;
              this.mixinDatacomErrorMessage = null;
            }
          }
        },
        immediate: false,
        deep: true
      },
      optsProps: {
        handler(val, oldval) {
          if (typeof val === "object") {
            if (JSON.stringify(val) !== JSON.stringify(oldval) && this.echarts === false && this.optsWatch == true) {
              this.checkData(this.drawData);
            }
          } else {
            this.mixinDatacomLoading = false;
            this._clearChart();
            this.showchart = false;
            this.mixinDatacomErrorMessage = "参数错误：opts数据类型错误";
          }
        },
        immediate: false,
        deep: true
      },
      eoptsProps: {
        handler(val, oldval) {
          if (typeof val === "object") {
            if (JSON.stringify(val) !== JSON.stringify(oldval) && this.echarts === true) {
              this.checkData(this.drawData);
            }
          } else {
            this.mixinDatacomLoading = false;
            this.showchart = false;
            this.mixinDatacomErrorMessage = "参数错误：eopts数据类型错误";
          }
        },
        immediate: false,
        deep: true
      },
      reshow(val, oldval) {
        if (val === true && this.mixinDatacomLoading === false) {
          setTimeout(() => {
            this.mixinDatacomErrorMessage = null;
            this.echartsResize.state = !this.echartsResize.state;
            this.checkData(this.drawData);
          }, 200);
        }
      },
      reload(val, oldval) {
        if (val === true) {
          this.showchart = false;
          this.mixinDatacomErrorMessage = null;
          this.reloading();
        }
      },
      mixinDatacomErrorMessage(val, oldval) {
        if (val) {
          this.emitMsg({ name: "error", params: { type: "error", errorShow: this.errorShow, msg: val, id: this.cid } });
          if (this.errorShow) {
            formatAppLog("log", "at uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue:611", "[秋云图表组件]" + val);
          }
        }
      },
      errorMessage(val, oldval) {
        if (val && this.errorShow && val !== null && val !== "null" && val !== "") {
          this.showchart = false;
          this.mixinDatacomLoading = false;
          this.mixinDatacomErrorMessage = val;
        } else {
          this.showchart = false;
          this.mixinDatacomErrorMessage = null;
          this.reloading();
        }
      }
    },
    computed: {
      optsProps() {
        return JSON.parse(JSON.stringify(this.opts));
      },
      eoptsProps() {
        return JSON.parse(JSON.stringify(this.eopts));
      },
      chartDataProps() {
        return JSON.parse(JSON.stringify(this.chartData));
      }
    },
    methods: {
      beforeInit() {
        this.mixinDatacomErrorMessage = null;
        if (typeof this.chartData === "object" && this.chartData != null && this.chartData.series !== void 0 && this.chartData.series.length > 0) {
          this.drawData = deepCloneAssign({}, this.chartData);
          this.mixinDatacomLoading = false;
          this.showchart = true;
          this.checkData(this.chartData);
        } else if (this.localdata.length > 0) {
          this.mixinDatacomLoading = false;
          this.showchart = true;
          this.localdataInit(this.localdata);
        } else if (this.collection !== "") {
          this.mixinDatacomLoading = false;
          this.getCloudData();
        } else {
          this.mixinDatacomLoading = true;
        }
      },
      localdataInit(resdata) {
        if (this.groupEnum.length > 0) {
          for (let i2 = 0; i2 < resdata.length; i2++) {
            for (let j2 = 0; j2 < this.groupEnum.length; j2++) {
              if (resdata[i2].group === this.groupEnum[j2].value) {
                resdata[i2].group = this.groupEnum[j2].text;
              }
            }
          }
        }
        if (this.textEnum.length > 0) {
          for (let i2 = 0; i2 < resdata.length; i2++) {
            for (let j2 = 0; j2 < this.textEnum.length; j2++) {
              if (resdata[i2].text === this.textEnum[j2].value) {
                resdata[i2].text = this.textEnum[j2].text;
              }
            }
          }
        }
        let needCategories = false;
        let tmpData = { categories: [], series: [] };
        let tmpcategories = [];
        let tmpseries = [];
        if (this.echarts === true) {
          needCategories = cfe.categories.includes(this.type);
        } else {
          needCategories = cfu.categories.includes(this.type);
        }
        if (needCategories === true) {
          if (this.chartData && this.chartData.categories && this.chartData.categories.length > 0) {
            tmpcategories = this.chartData.categories;
          } else {
            if (this.startDate && this.endDate) {
              let idate = new Date(this.startDate);
              let edate = new Date(this.endDate);
              while (idate <= edate) {
                tmpcategories.push(getFormatDate(idate));
                idate = idate.setDate(idate.getDate() + 1);
                idate = new Date(idate);
              }
            } else {
              let tempckey = {};
              resdata.map(function(item, index) {
                if (item.text != void 0 && !tempckey[item.text]) {
                  tmpcategories.push(item.text);
                  tempckey[item.text] = true;
                }
              });
            }
          }
          tmpData.categories = tmpcategories;
        }
        let tempskey = {};
        resdata.map(function(item, index) {
          if (item.group != void 0 && !tempskey[item.group]) {
            tmpseries.push({ name: item.group, data: [] });
            tempskey[item.group] = true;
          }
        });
        if (tmpseries.length == 0) {
          tmpseries = [{ name: "默认分组", data: [] }];
          if (needCategories === true) {
            for (let j2 = 0; j2 < tmpcategories.length; j2++) {
              let seriesdata = 0;
              for (let i2 = 0; i2 < resdata.length; i2++) {
                if (resdata[i2].text == tmpcategories[j2]) {
                  seriesdata = resdata[i2].value;
                }
              }
              tmpseries[0].data.push(seriesdata);
            }
          } else {
            for (let i2 = 0; i2 < resdata.length; i2++) {
              tmpseries[0].data.push({ "name": resdata[i2].text, "value": resdata[i2].value });
            }
          }
        } else {
          for (let k = 0; k < tmpseries.length; k++) {
            if (tmpcategories.length > 0) {
              for (let j2 = 0; j2 < tmpcategories.length; j2++) {
                let seriesdata = 0;
                for (let i2 = 0; i2 < resdata.length; i2++) {
                  if (tmpseries[k].name == resdata[i2].group && resdata[i2].text == tmpcategories[j2]) {
                    seriesdata = resdata[i2].value;
                  }
                }
                tmpseries[k].data.push(seriesdata);
              }
            } else {
              for (let i2 = 0; i2 < resdata.length; i2++) {
                if (tmpseries[k].name == resdata[i2].group) {
                  tmpseries[k].data.push(resdata[i2].value);
                }
              }
            }
          }
        }
        tmpData.series = tmpseries;
        this.drawData = deepCloneAssign({}, tmpData);
        this.checkData(tmpData);
      },
      reloading() {
        if (this.errorReload === false) {
          return;
        }
        this.showchart = false;
        this.mixinDatacomErrorMessage = null;
        if (this.collection !== "") {
          this.mixinDatacomLoading = false;
          this.onMixinDatacomPropsChange(true);
        } else {
          this.beforeInit();
        }
      },
      checkData(anyData) {
        let cid = this.cid;
        if (this.echarts === true) {
          cfe.option[cid] = deepCloneAssign({}, this.eopts);
          cfe.option[cid].id = cid;
          cfe.option[cid].type = this.type;
        } else {
          if (this.type && cfu.type.includes(this.type)) {
            cfu.option[cid] = deepCloneAssign({}, cfu[this.type], this.opts);
            cfu.option[cid].canvasId = cid;
          } else {
            this.mixinDatacomLoading = false;
            this.showchart = false;
            this.mixinDatacomErrorMessage = "参数错误：props参数中type类型不正确";
          }
        }
        let newData = deepCloneAssign({}, anyData);
        if (newData.series !== void 0 && newData.series.length > 0) {
          this.mixinDatacomErrorMessage = null;
          if (this.echarts === true) {
            cfe.option[cid].chartData = newData;
            this.$nextTick(() => {
              this.init();
            });
          } else {
            cfu.option[cid].categories = newData.categories;
            cfu.option[cid].series = newData.series;
            this.$nextTick(() => {
              this.init();
            });
          }
        }
      },
      resizeHandler() {
        let currTime = Date.now();
        let lastDrawTime = this.lastDrawTime ? this.lastDrawTime : currTime - 3e3;
        let duration = currTime - lastDrawTime;
        if (duration < 1e3)
          return;
        uni.createSelectorQuery().in(this).select("#ChartBoxId" + this.cid).boundingClientRect((data) => {
          this.showchart = true;
          if (data.width > 0 && data.height > 0) {
            if (data.width !== this.cWidth || data.height !== this.cHeight) {
              this.checkData(this.drawData);
            }
          }
        }).exec();
      },
      getCloudData() {
        if (this.mixinDatacomLoading == true) {
          return;
        }
        this.mixinDatacomLoading = true;
        this.mixinDatacomGet().then((res) => {
          this.mixinDatacomResData = res.result.data;
          this.localdataInit(this.mixinDatacomResData);
        }).catch((err) => {
          this.mixinDatacomLoading = false;
          this.showchart = false;
          this.mixinDatacomErrorMessage = "请求错误：" + err;
        });
      },
      onMixinDatacomPropsChange(needReset, changed) {
        if (needReset == true && this.collection !== "") {
          this.showchart = false;
          this.mixinDatacomErrorMessage = null;
          this._clearChart();
          this.getCloudData();
        }
      },
      _clearChart() {
        let cid = this.cid;
        if (this.echarts !== true && cfu.option[cid] && cfu.option[cid].context) {
          const ctx = cfu.option[cid].context;
          if (typeof ctx === "object" && !!!cfu.option[cid].update) {
            ctx.clearRect(0, 0, this.cWidth * this.pixel, this.cHeight * this.pixel);
            ctx.draw();
          }
        }
      },
      init() {
        let cid = this.cid;
        uni.createSelectorQuery().in(this).select("#ChartBoxId" + cid).boundingClientRect((data) => {
          if (data.width > 0 && data.height > 0) {
            this.mixinDatacomLoading = false;
            this.showchart = true;
            this.lastDrawTime = Date.now();
            this.cWidth = data.width;
            this.cHeight = data.height;
            if (this.echarts !== true) {
              cfu.option[cid].background = this.background == "rgba(0,0,0,0)" ? "#FFFFFF" : this.background;
              cfu.option[cid].canvas2d = this.type2d;
              cfu.option[cid].pixelRatio = this.pixel;
              cfu.option[cid].animation = this.animation;
              cfu.option[cid].width = data.width * this.pixel;
              cfu.option[cid].height = data.height * this.pixel;
              cfu.option[cid].onzoom = this.onzoom;
              cfu.option[cid].ontap = this.ontap;
              cfu.option[cid].ontouch = this.ontouch;
              cfu.option[cid].onmouse = this.openmouse;
              cfu.option[cid].onmovetip = this.onmovetip;
              cfu.option[cid].tooltipShow = this.tooltipShow;
              cfu.option[cid].tooltipFormat = this.tooltipFormat;
              cfu.option[cid].tooltipCustom = this.tooltipCustom;
              cfu.option[cid].inScrollView = this.inScrollView;
              cfu.option[cid].lastDrawTime = this.lastDrawTime;
              cfu.option[cid].tapLegend = this.tapLegend;
            }
            if (this.inH5 || this.inApp) {
              if (this.echarts == true) {
                cfe.option[cid].ontap = this.ontap;
                cfe.option[cid].onmouse = this.openmouse;
                cfe.option[cid].tooltipShow = this.tooltipShow;
                cfe.option[cid].tooltipFormat = this.tooltipFormat;
                cfe.option[cid].tooltipCustom = this.tooltipCustom;
                cfe.option[cid].lastDrawTime = this.lastDrawTime;
                this.echartsOpts = deepCloneAssign({}, cfe.option[cid]);
              } else {
                cfu.option[cid].rotateLock = cfu.option[cid].rotate;
                this.uchartsOpts = deepCloneAssign({}, cfu.option[cid]);
              }
            } else {
              cfu.option[cid] = formatterAssign(cfu.option[cid], cfu.formatter);
              this.mixinDatacomErrorMessage = null;
              this.mixinDatacomLoading = false;
              this.showchart = true;
              this.$nextTick(() => {
                if (this.type2d === true) {
                  const query = uni.createSelectorQuery().in(this);
                  query.select("#" + cid).fields({ node: true, size: true }).exec((res) => {
                    if (res[0]) {
                      const canvas = res[0].node;
                      const ctx = canvas.getContext("2d");
                      cfu.option[cid].context = ctx;
                      cfu.option[cid].rotateLock = cfu.option[cid].rotate;
                      if (cfu.instance[cid] && cfu.option[cid] && cfu.option[cid].update === true) {
                        this._updataUChart(cid);
                      } else {
                        canvas.width = data.width * this.pixel;
                        canvas.height = data.height * this.pixel;
                        canvas._width = data.width * this.pixel;
                        canvas._height = data.height * this.pixel;
                        setTimeout(() => {
                          cfu.option[cid].context.restore();
                          cfu.option[cid].context.save();
                          this._newChart(cid);
                        }, 100);
                      }
                    } else {
                      this.showchart = false;
                      this.mixinDatacomErrorMessage = "参数错误：开启2d模式后，未获取到dom节点，canvas-id:" + cid;
                    }
                  });
                } else {
                  if (this.inAli) {
                    cfu.option[cid].rotateLock = cfu.option[cid].rotate;
                  }
                  cfu.option[cid].context = uni.createCanvasContext(cid, this);
                  if (cfu.instance[cid] && cfu.option[cid] && cfu.option[cid].update === true) {
                    this._updataUChart(cid);
                  } else {
                    setTimeout(() => {
                      cfu.option[cid].context.restore();
                      cfu.option[cid].context.save();
                      this._newChart(cid);
                    }, 100);
                  }
                }
              });
            }
          } else {
            this.mixinDatacomLoading = false;
            this.showchart = false;
            if (this.reshow == true) {
              this.mixinDatacomErrorMessage = "布局错误：未获取到父元素宽高尺寸！canvas-id:" + cid;
            }
          }
        }).exec();
      },
      saveImage() {
        uni.canvasToTempFilePath({
          canvasId: this.cid,
          success: (res) => {
            uni.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function() {
                uni.showToast({
                  title: "保存成功",
                  duration: 2e3
                });
              }
            });
          }
        }, this);
      },
      getImage() {
        if (this.type2d == false) {
          uni.canvasToTempFilePath({
            canvasId: this.cid,
            success: (res) => {
              this.emitMsg({ name: "getImage", params: { type: "getImage", base64: res.tempFilePath } });
            }
          }, this);
        } else {
          const query = uni.createSelectorQuery().in(this);
          query.select("#" + this.cid).fields({ node: true, size: true }).exec((res) => {
            if (res[0]) {
              const canvas = res[0].node;
              this.emitMsg({ name: "getImage", params: { type: "getImage", base64: canvas.toDataURL("image/png") } });
            }
          });
        }
      },
      _error(e2) {
        this.mixinDatacomErrorMessage = e2.detail.errMsg;
      },
      emitMsg(msg) {
        this.$emit(msg.name, msg.params);
      },
      getRenderType() {
        if (this.echarts === true && this.mixinDatacomLoading === false) {
          this.beforeInit();
        }
      },
      toJSON() {
        return this;
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_qiun_loading = resolveEasycom(vue.resolveDynamicComponent("qiun-loading"), __easycom_0$1);
    const _component_qiun_error = resolveEasycom(vue.resolveDynamicComponent("qiun-error"), __easycom_1);
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "chartsview",
      id: "ChartBoxId" + $data.cid
    }, [
      _ctx.mixinDatacomLoading ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
        vue.createCommentVNode(" 自定义加载状态，请改这里 "),
        vue.createVNode(_component_qiun_loading, { loadingType: $props.loadingType }, null, 8, ["loadingType"])
      ])) : vue.createCommentVNode("v-if", true),
      _ctx.mixinDatacomErrorMessage && $props.errorShow ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        onClick: _cache[0] || (_cache[0] = (...args) => $options.reloading && $options.reloading(...args))
      }, [
        vue.createCommentVNode(" 自定义错误提示，请改这里 "),
        vue.createVNode(_component_qiun_error, { errorMessage: $props.errorMessage }, null, 8, ["errorMessage"])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" APP和H5采用renderjs渲染图表 "),
      $data.echarts ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        style: vue.normalizeStyle([{ background: $props.background }, { "width": "100%", "height": "100%" }]),
        "data-directory": $props.directory,
        id: "EC" + $data.cid,
        prop: vue.wp($data.echartsOpts),
        "change:prop": _ctx.rdcharts.ecinit,
        resize: vue.wp($data.echartsResize),
        "change:resize": _ctx.rdcharts.ecresize
      }, null, 12, ["data-directory", "id", "prop", "change:prop", "resize", "change:resize"])), [
        [vue.vShow, $data.showchart]
      ]) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        onClick: _cache[2] || (_cache[2] = (...args) => _ctx.rdcharts.tap && _ctx.rdcharts.tap(...args)),
        onMousemove: _cache[3] || (_cache[3] = (...args) => _ctx.rdcharts.mouseMove && _ctx.rdcharts.mouseMove(...args)),
        onMousedown: _cache[4] || (_cache[4] = (...args) => _ctx.rdcharts.mouseDown && _ctx.rdcharts.mouseDown(...args)),
        onMouseup: _cache[5] || (_cache[5] = (...args) => _ctx.rdcharts.mouseUp && _ctx.rdcharts.mouseUp(...args)),
        onTouchstart: _cache[6] || (_cache[6] = (...args) => _ctx.rdcharts.touchStart && _ctx.rdcharts.touchStart(...args)),
        onTouchmove: _cache[7] || (_cache[7] = (...args) => _ctx.rdcharts.touchMove && _ctx.rdcharts.touchMove(...args)),
        onTouchend: _cache[8] || (_cache[8] = (...args) => _ctx.rdcharts.touchEnd && _ctx.rdcharts.touchEnd(...args)),
        id: "UC" + $data.cid,
        prop: vue.wp($data.uchartsOpts),
        "change:prop": _ctx.rdcharts.ucinit
      }, [
        vue.withDirectives(vue.createElementVNode("canvas", {
          id: $data.cid,
          canvasId: $data.cid,
          style: vue.normalizeStyle({ width: $data.cWidth + "px", height: $data.cHeight + "px", background: $props.background }),
          "disable-scroll": $props.disableScroll,
          onError: _cache[1] || (_cache[1] = (...args) => $options._error && $options._error(...args))
        }, null, 44, ["id", "canvasId", "disable-scroll"]), [
          [vue.vShow, $data.showchart]
        ])
      ], 40, ["id", "prop", "change:prop"])),
      vue.createCommentVNode(" 支付宝小程序 "),
      vue.createCommentVNode(" 其他小程序通过vue渲染图表 ")
    ], 8, ["id"]);
  }
  if (typeof block0 === "function")
    block0(_sfc_main$9);
  const __easycom_7 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-0ca34aee"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue"]]);
  const base_url = "http://110.42.214.164:8003";
  const timeout$1 = 5e3;
  const request = (params) => {
    let url2 = params.url;
    let method = params.method || "get";
    let data = params.data || {};
    let header = {
      "Blade-Auth": uni.getStorageSync("token") || "",
      "Content-Type": "application/json;charset=UTF-8",
      "Authorization": "Basic c2FiZXI6c2FiZXJfc2VjcmV0",
      "Tenant-Id": uni.getStorageSync("tenantId") || "xxx",
      // avue配置相关
      ...params.header
    };
    if (method == "POST") {
      header = {
        "Content-Type": "application/json"
        // 自定义，与后端约定好格式
      };
    }
    return new Promise((resolve, reject) => {
      uni.request({
        url: base_url + url2,
        method,
        header,
        data,
        timeout: timeout$1,
        success(response) {
          const res = response;
          if (res.statusCode == 200) {
            resolve(res.data);
          } else {
            uni.clearStorageSync();
            switch (res.statusCode) {
            }
          }
        },
        fail(err) {
          formatAppLog("log", "at request/index.js:67", err);
          if (err.errMsg.indexOf("request:fail") !== -1)
            ;
          reject(err);
        },
        complete() {
          uni.hideToast();
        }
      });
    }).catch(() => {
    });
  };
  const GetAllDevices = () => {
    return request({
      url: "/sensor",
      method: "get",
      data: {},
      header: {}
    });
  };
  const GetTimeXData = (ftime, device, tableName) => {
    return request({
      url: `/timeSeries/X/${ftime}/${device}/${tableName}`,
      method: "get",
      data: {},
      header: {}
    });
  };
  const GetTimeYData = (ftime, device, tableName) => {
    return request({
      url: `/timeSeries/Y/${ftime}/${device}/${tableName}`,
      method: "get",
      data: {},
      header: {}
    });
  };
  const GetTimeZData = (ftime, device, tableName) => {
    return request({
      url: `/timeSeries/Z/${ftime}/${device}/${tableName}`,
      method: "get",
      data: {},
      header: {}
    });
  };
  const GetAmplitudeXData = (ftime, device) => {
    return request({
      url: `/frequency/X/${ftime}/${device}`,
      method: "get",
      data: {},
      header: {}
    });
  };
  const GetAmplitudeYData = (ftime, device) => {
    return request({
      url: `/frequency/Y/${ftime}/${device}`,
      method: "get",
      data: {},
      header: {}
    });
  };
  const GetAmplitudeZData = (ftime, device) => {
    return request({
      url: `/frequency/Z/${ftime}/${device}`,
      method: "get",
      data: {},
      header: {}
    });
  };
  const PostTimeDataAnomaly = (anomaly) => {
    return request({
      url: "/TimeAnomaly",
      method: "POST",
      data: anomaly,
      header: {}
    });
  };
  const PostAmplitudeDataAnomaly = (anomaly) => {
    return request({
      url: "/SpectrumAnomaly",
      method: "POST",
      data: anomaly,
      header: {}
    });
  };
  const secondItv$2 = 8;
  const minuteItv$2 = 480;
  const hourItv$2 = 28800;
  const dayItv$2 = 86400;
  const monthItv$2 = 24e5;
  const yearItv$2 = 288e5;
  const anomalyGap$2 = 3e5;
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
    __name: "SensorDetail8",
    setup(__props, { expose: __expose }) {
      __expose();
      const settingsVisible = vue.ref(false);
      const isValid = vue.ref(true);
      const isPeak = vue.ref(true);
      const timeLimitValue = vue.ref();
      const ampLimitValue = vue.ref();
      const toggleSettings = () => {
        settingsVisible.value = !settingsVisible.value;
      };
      const handleSwitchChange = (key, event) => {
        getChartInfo();
      };
      onNavigationBarButtonTap((e2) => {
        settingsVisible.value = !settingsVisible.value;
      });
      const confirmTimeLimitInput = () => {
        if (timeLimitValue.value) {
          if (timeLimitValue.value <= 0) {
            uni.showModal({
              title: "提示",
              content: "时程阈值应为正数，请重新输入。",
              showCancel: false,
              confirmText: "好的",
              success: () => {
                timeLimitValue.value = null;
              }
            });
          } else {
            timeChartOpts.value.extra.markLine.data[1].value = timeLimitValue.value;
            timeChartOpts.value.extra.markLine.data[2].value = -timeLimitValue.value;
            timeDataThreshold.value = timeLimitValue.value;
          }
        }
      };
      const confirmAmpLimitInput = () => {
        if (ampLimitValue.value) {
          if (ampLimitValue.value <= 0) {
            uni.showModal({
              title: "提示",
              content: "频谱阈值应为正数，请重新输入。",
              showCancel: false,
              confirmText: "好的",
              success: () => {
                ampLimitValue.value = null;
              }
            });
          } else {
            amplitudeChartOpts.value.extra.markLine.data[0].value = ampLimitValue.value;
            ampDataThreshold.value = ampLimitValue.value;
          }
        }
      };
      const toast2 = vue.ref(null);
      const showModal = vue.ref(true);
      let allDevices = vue.ref([]);
      let selectedDeviceId = vue.ref("");
      const getAllDevices = async () => {
        GetAllDevices().then((res) => {
          allDevices.value = res.data;
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail8.vue:266", "Error getting all devices: ", error2);
        });
      };
      let selectedDegree = vue.ref("秒");
      let selectedTableName = vue.ref("time_series");
      let selectedInterval = vue.ref(8);
      let degreeSelectList = vue.ref([
        { name: "秒", disabled: false },
        { name: "分", disabled: false },
        { name: "时", disabled: false },
        { name: "日", disabled: false },
        { name: "月", disabled: false },
        { name: "年", disabled: false }
      ]);
      let degreeSelectValue = vue.ref("秒");
      let isTimeLoading = vue.ref(false);
      let isAmpLoading = vue.ref(false);
      let lastCount = vue.ref(0);
      const degreeRadioChange = (e2) => {
        isLastDegree.value = false;
        lastCount.value = 0;
        selectedDegree.value = e2;
        if (e2 === "秒") {
          selectedTableName.value = "time_series";
          selectedInterval.value = secondItv$2;
        } else if (e2 === "分") {
          selectedTableName.value = "time_series_minutes";
          selectedInterval.value = minuteItv$2;
        } else if (e2 === "时") {
          selectedTableName.value = "time_series_hours";
          selectedInterval.value = hourItv$2;
        } else if (e2 === "日") {
          selectedTableName.value = "time_series_days";
          selectedInterval.value = dayItv$2;
        } else if (e2 === "月") {
          selectedTableName.value = "time_series_months";
          selectedInterval.value = monthItv$2;
        } else if (e2 === "年") {
          selectedTableName.value = "time_series_years";
          selectedInterval.value = yearItv$2;
        } else {
          formatAppLog("error", "at pages/index/SensorDetail8.vue:360", "radioChange failed!");
        }
        isTimeLoading.value = true;
        setTimeout(() => {
          isTimeLoading.value = false;
        }, 2e3);
        adjustTimeYAxis();
      };
      let isLastDegree = vue.ref(false);
      let lastXData = vue.ref([]);
      let lastYData = vue.ref([]);
      let lastZData = vue.ref([]);
      let lastTimeDataRMS = vue.ref([0, 0, 0]);
      let lastTimeDataPV = vue.ref([0, 0, 0]);
      const toLastDegree = () => {
        isLastDegree.value = true;
        lastCount.value += 1;
        isTimeLoading.value = true;
        setTimeout(() => {
          isTimeLoading.value = false;
        }, 1500);
      };
      const toDataNow = () => {
        isLastDegree.value = false;
        lastCount.value = 0;
        isTimeLoading.value = true;
        setTimeout(() => {
          isTimeLoading.value = false;
        }, 1e3);
      };
      const getLastTimeData = async () => {
        let timeStamp = transLastStamp(107, selectedTableName.value);
        if (timeStamp === 0) {
          let dataNum = 0;
          let gap = 0;
          let timeSeriesData;
          let response;
          if (selectedTableName.value === "time_series_months")
            dataNum = 1080, gap = 2592e6;
          else if (selectedTableName.value === "time_series_years")
            dataNum = 1095, gap = 31536e6;
          timeSeriesData = new Array(dataNum).fill(null);
          response = {
            categories: caculateTimeList(17355744e5 - lastCount.value * gap, selectedInterval.value),
            series: [{ name: axisOrder[curAxisIndex.value], data: timeSeriesData }]
          };
          lastXData.value = JSON.parse(JSON.stringify(response));
          lastYData.value = JSON.parse(JSON.stringify(processTimeData(response)));
          lastZData.value = JSON.parse(JSON.stringify(processTimeData(response)));
          lastTimeDataRMS.value[0] = 0;
          lastTimeDataRMS.value[1] = 0;
          lastTimeDataRMS.value[2] = 0;
          lastTimeDataPV.value[0] = 0;
          lastTimeDataPV.value[1] = 0;
          lastTimeDataPV.value[2] = 0;
        }
        GetTimeXData(timeStamp, selectedDeviceId.value, selectedTableName.value).then((res) => {
          let xresponse = res.data;
          lastXData.value = JSON.parse(JSON.stringify(processTimeData(xresponse)));
          lastTimeDataRMS.value[0] = parseFloat(calculateTimeRMS(xresponse.data).toFixed(6));
          lastTimeDataPV.value[0] = parseFloat(calculateTimePV(xresponse.data).toFixed(6));
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail8.vue:436", "Error getting X last Data: " + selectedTableName.value, error2);
        });
        GetTimeYData(timeStamp, selectedDeviceId.value, selectedTableName.value).then((res) => {
          let yresponse = res.data;
          lastYData.value = JSON.parse(JSON.stringify(processTimeData(yresponse)));
          lastTimeDataRMS.value[1] = parseFloat(calculateTimeRMS(yresponse.data).toFixed(6));
          lastTimeDataPV.value[1] = parseFloat(calculateTimePV(yresponse.data).toFixed(6));
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail8.vue:448", "Error getting Y last Data: " + selectedTableName.value, error2);
        });
        GetTimeZData(timeStamp, selectedDeviceId.value, selectedTableName.value).then((res) => {
          let zresponse = res.data;
          lastZData.value = JSON.parse(JSON.stringify(processTimeData(zresponse)));
          lastTimeDataRMS.value[2] = parseFloat(calculateTimeRMS(zresponse.data).toFixed(6));
          lastTimeDataPV.value[2] = parseFloat(calculateTimePV(zresponse.data).toFixed(6));
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail8.vue:460", "Error getting Z last Data: " + selectedTableName.value, error2);
        });
        if (isLastDegree.value) {
          if (curAxisIndex.value === 0) {
            timeChartData.value = lastXData.value;
          } else if (curAxisIndex.value === 1) {
            timeChartData.value = lastYData.value;
          } else if (curAxisIndex.value === 2) {
            timeChartData.value = lastZData.value;
          }
        }
      };
      const adjustTimeYAxis = () => {
        if (selectedDegree.value === "秒") {
          timeChartMin.value = -0.2;
          timeChartMax.value = 0.2;
          timeChartFormat.value = "yAxisFix1";
        } else if (selectedDegree.value === "分") {
          timeChartMin.value = -0.03;
          timeChartMax.value = 0.03;
          timeChartFormat.value = "yAxisFix2";
        } else if (selectedDegree.value === "时") {
          timeChartMin.value = -5e-3;
          timeChartMax.value = 5e-3;
          timeChartFormat.value = "yAxisFix3";
        } else if (selectedDegree.value === "日") {
          timeChartMin.value = -1e-3;
          timeChartMax.value = 1e-3;
          timeChartFormat.value = "yAxisFix4";
        } else if (selectedDegree.value === "月") {
          timeChartMin.value = -1e-3;
          timeChartMax.value = 1e-3;
          timeChartFormat.value = "yAxisFix4";
        } else if (selectedDegree.value === "年") {
          timeChartMin.value = -2e-4;
          timeChartMax.value = 2e-4;
          timeChartFormat.value = "yAxisFix5";
        } else {
          formatAppLog("error", "at pages/index/SensorDetail8.vue:502", "radioChange failed!");
        }
        timeChartOpts.value.yAxis.data[0].min = timeChartMin.value;
        timeChartOpts.value.yAxis.data[0].max = timeChartMax.value;
        timeChartOpts.value.yAxis.data[0].format = timeChartFormat.value;
      };
      const transformTimeStamp = (ms2, degree) => {
        if (degree === "time_series") {
          const timeNow = /* @__PURE__ */ new Date();
          const currentHours = timeNow.getHours();
          const currentMinutes = timeNow.getMinutes();
          const currentSeconds = timeNow.getSeconds();
          const timeNew = new Date(2025, 0, 5, currentHours, currentMinutes, currentSeconds + 1, ms2);
          return timeNew.getTime();
        } else if (degree === "time_series_minutes") {
          const timeNow = /* @__PURE__ */ new Date();
          const currentYear = timeNow.getFullYear();
          const currentMonth = timeNow.getMonth();
          const currentDay = timeNow.getDate();
          const currentHours = timeNow.getHours();
          const currentMinutes = timeNow.getMinutes();
          const timeNew = new Date(currentYear, currentMonth, currentDay, currentHours, currentMinutes + 1, 0, ms2);
          return timeNew.getTime();
        } else if (degree === "time_series_hours") {
          const timeNow = /* @__PURE__ */ new Date();
          const currentYear = timeNow.getFullYear();
          const currentMonth = timeNow.getMonth();
          const currentDay = timeNow.getDate();
          const currentHours = timeNow.getHours();
          const timeNew = new Date(currentYear, currentMonth, currentDay, currentHours + 1, 0, 0, ms2);
          return timeNew.getTime();
        } else if (degree === "time_series_days") {
          const timeNow = /* @__PURE__ */ new Date();
          const currentYear = timeNow.getFullYear();
          const currentMonth = timeNow.getMonth();
          const currentDay = timeNow.getDate();
          const timeNew = new Date(currentYear, currentMonth, currentDay + 1, 0, 0, 0, ms2);
          return timeNew.getTime();
        } else if (degree === "time_series_months") {
          return 17382528e5;
        } else if (degree === "time_series_years") {
          return 17671968e5;
        }
        formatAppLog("error", "at pages/index/SensorDetail8.vue:551", "transformTimeStamp failed!");
        return Date.now();
      };
      const transLastStamp = (ms2, degree) => {
        if (degree === "time_series_days") {
          const timeNow = /* @__PURE__ */ new Date();
          const currentYear = timeNow.getFullYear();
          const currentMonth = timeNow.getMonth();
          const currentDay = timeNow.getDate();
          const timeNew = new Date(currentYear, currentMonth, currentDay - lastCount.value + 1, 0, 0, 0, ms2);
          return timeNew.getTime();
        } else if (degree === "time_series_months") {
          if (lastCount.value === 0 || lastCount.value === 1)
            return 17355744e5;
          else
            return 0;
        } else if (degree === "time_series_years") {
          if (lastCount.value === 0 || lastCount.value === 1)
            return 17355744e5;
          else
            return 0;
        }
        return Date.now();
      };
      const padZero = (num) => num.toString().padStart(2, "0");
      const caculateTimeList = (start, interval) => {
        const time_list = [];
        let beijingTimeString = "";
        let i2 = 0;
        let dataNum = 1e3;
        if (interval === monthItv$2)
          dataNum = 1080;
        else if (interval === yearItv$2)
          dataNum = 1095;
        for (; i2 < dataNum; i2++) {
          const date2 = new Date(start + i2 * interval);
          const year = date2.getFullYear();
          const month = date2.getMonth() + 1;
          const day = date2.getDate();
          const hour = (date2.getUTCHours() + 8) % 24;
          const minute = date2.getUTCMinutes();
          const second = date2.getUTCSeconds();
          if (interval === secondItv$2) {
            beijingTimeString = `${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
          } else if (interval === minuteItv$2) {
            beijingTimeString = `${padZero(hour)}:${padZero(minute)}`;
          } else if (interval === hourItv$2) {
            beijingTimeString = `${padZero(hour)}:${padZero(0)}`;
          } else if (interval === dayItv$2) {
            beijingTimeString = `${day}日${padZero(hour)}时`;
          } else if (interval === monthItv$2) {
            beijingTimeString = `${month}月${day}日`;
          } else if (interval === yearItv$2) {
            beijingTimeString = `${year}年${month}月`;
          }
          time_list.push(beijingTimeString);
        }
        return time_list;
      };
      let timeXData = vue.ref([]);
      let timeYData = vue.ref([]);
      let timeZData = vue.ref([]);
      let timeChartData = vue.ref([]);
      let timeDataRMS = vue.ref([0, 0, 0]);
      let timeDataPV = vue.ref([0, 0, 0]);
      let timeDataThreshold = vue.ref(0.2);
      let timeChartMin = vue.ref(-0.3);
      let timeChartMax = vue.ref(0.3);
      let timeChartFormat = vue.ref("yAxisFix2");
      let timeChartOpts = vue.ref({
        dataLabel: false,
        update: true,
        duration: 0,
        dataPointShape: false,
        padding: [20, 30, 0, 5],
        xAxis: { axisLine: false, boundaryGap: "justify", labelCount: 6 },
        yAxis: { gridType: "solid", data: [{ min: timeChartMin.value, max: timeChartMax.value, format: timeChartFormat.value }] },
        extra: { markLine: { data: [
          { value: 0, lineColor: "#000000", showLabel: true, labelOffsetX: -10 },
          // 中轴标记线
          { value: timeDataThreshold.value, lineColor: "#DE4A42", showLabel: true, labelOffsetX: -10 },
          // 正阈值标记线
          { value: -timeDataThreshold.value, lineColor: "#DE4A42", showLabel: true, labelOffsetX: -10 }
          // ### Question 阈值需要负的吗？
        ] } }
      });
      const getTimeData = async () => {
        let timeStamp = transformTimeStamp(107, selectedTableName.value);
        GetTimeXData(timeStamp, selectedDeviceId.value, selectedTableName.value).then((res) => {
          let xresponse = res.data;
          timeXData.value = JSON.parse(JSON.stringify(processTimeData(xresponse)));
          timeDataRMS.value[0] = parseFloat(calculateTimeRMS(xresponse.data).toFixed(6));
          timeDataPV.value[0] = parseFloat(calculateTimePV(xresponse.data).toFixed(6));
          checkTimeData(xresponse);
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail8.vue:667", "Error getting X time Data: ", error2);
        });
        GetTimeYData(timeStamp, selectedDeviceId.value, selectedTableName.value).then((res) => {
          let yresponse = res.data;
          timeYData.value = JSON.parse(JSON.stringify(processTimeData(yresponse)));
          timeDataRMS.value[1] = parseFloat(calculateTimeRMS(yresponse.data).toFixed(6));
          timeDataPV.value[1] = parseFloat(calculateTimePV(yresponse.data).toFixed(6));
          checkTimeData(yresponse);
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail8.vue:698", "Error getting Y time Data: ", error2);
        });
        GetTimeZData(timeStamp, selectedDeviceId.value, selectedTableName.value).then((res) => {
          let zresponse = res.data;
          timeZData.value = JSON.parse(JSON.stringify(processTimeData(zresponse)));
          timeDataRMS.value[2] = parseFloat(calculateTimeRMS(zresponse.data).toFixed(6));
          timeDataPV.value[2] = parseFloat(calculateTimePV(zresponse.data).toFixed(6));
          checkTimeData(zresponse);
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail8.vue:728", "Error getting Z time Data: ", error2);
        });
        if (!isLastDegree.value) {
          if (curAxisIndex.value === 0) {
            timeChartData.value = timeXData.value;
          } else if (curAxisIndex.value === 1) {
            timeChartData.value = timeYData.value;
          } else if (curAxisIndex.value === 2) {
            timeChartData.value = timeZData.value;
          }
        }
        getChartInfo();
      };
      const processTimeData = (originalData) => {
        let timeList = caculateTimeList(originalData.sdata, selectedInterval.value);
        let timeSeriesData;
        if (!isLastDegree.value && selectedTableName.value === "time_series_days") {
          const timeNow = /* @__PURE__ */ new Date();
          const currentYear = timeNow.getFullYear();
          const currentMonth = timeNow.getMonth();
          const currentDay = timeNow.getDate();
          const timeDayBegin = new Date(currentYear, currentMonth, currentDay, 0, 0, 0, 107);
          const dataCount = Math.floor((timeNow.getTime() - timeDayBegin.getTime()) / dayItv$2);
          timeSeriesData = originalData.data.map((item, index) => index < dataCount ? item : null);
        } else if (!isLastDegree.value && selectedTableName.value === "time_series_months") {
          const timeNow = new Date(2025, 0, 6, 0, 0, 0, 107);
          const timeDayBegin = new Date(2025, 0, 1, 0, 0, 0, 107);
          const dataCount = Math.floor((timeNow.getTime() - timeDayBegin.getTime()) / monthItv$2);
          timeSeriesData = originalData.data.map((item, index) => index < dataCount ? item : null);
        } else {
          timeSeriesData = originalData.data;
        }
        let resData = {
          categories: timeList,
          series: [{ name: originalData.direction + "轴", data: timeSeriesData }]
        };
        return resData;
      };
      const calculateTimePV = (data) => {
        return data.length > 0 ? Math.max(...data) : void 0;
      };
      const calculateTimeRMS = (data) => {
        let sqSum = 0;
        data.forEach((d2) => {
          sqSum += d2 * d2;
        });
        return data.length > 0 ? Math.sqrt(sqSum / (data.length + 1)) : void 0;
      };
      let amplitudeXData = vue.ref([]);
      let amplitudeYData = vue.ref([]);
      let amplitudeZData = vue.ref([]);
      let amplitudeChartData = vue.ref([]);
      let amplitudeDataRMS = vue.ref([0, 0, 0]);
      let amplitudeDataPV = vue.ref([0, 0, 0]);
      let ampDataThreshold = vue.ref(0.02);
      let amplitudeChartOpts = vue.ref({
        dataLabel: false,
        update: true,
        duration: 0,
        dataPointShape: false,
        padding: [20, 30, 0, 5],
        xAxis: { boundaryGap: "justify", labelCount: 12 },
        yAxis: { gridType: "solid", data: [{ min: 0, max: 0.03, format: "yAxisFix3" }] },
        extra: { markLine: { data: [
          { value: ampDataThreshold, lineColor: "#DE4A42", showLabel: true, labelOffsetX: -10 }
          // 阈值标记线
        ] } }
      });
      const getAmplitudeData = async () => {
        let timeStamp = transformTimeStamp(0, "time_series");
        GetAmplitudeXData(timeStamp, selectedDeviceId.value).then((res) => {
          let xresponse = res.data;
          amplitudeXData.value = JSON.parse(JSON.stringify(processAmpData(xresponse)));
          amplitudeDataRMS.value[0] = parseFloat(calculateAmplitudeRMS(xresponse.data).toFixed(3));
          amplitudeDataPV.value[0] = parseFloat(calculateAmplitudePV(xresponse.data).toFixed(3));
          checkAmpData(xresponse);
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail8.vue:847", "Error getting X amplitude Data: ", error2);
        });
        GetAmplitudeYData(timeStamp, selectedDeviceId.value).then((res) => {
          let yresponse = res.data;
          amplitudeYData.value = JSON.parse(JSON.stringify(processAmpData(yresponse)));
          amplitudeDataRMS.value[1] = parseFloat(calculateAmplitudeRMS(yresponse.data).toFixed(3));
          amplitudeDataPV.value[1] = parseFloat(calculateAmplitudePV(yresponse.data).toFixed(3));
          checkAmpData(yresponse);
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail8.vue:877", "Error getting Y amplitude Data: ", error2);
        });
        GetAmplitudeZData(timeStamp, selectedDeviceId.value).then((res) => {
          let zresponse = res.data;
          amplitudeZData.value = JSON.parse(JSON.stringify(processAmpData(zresponse)));
          amplitudeDataRMS.value[2] = parseFloat(calculateAmplitudeRMS(zresponse.data).toFixed(3));
          amplitudeDataPV.value[2] = parseFloat(calculateAmplitudePV(zresponse.data).toFixed(3));
          checkAmpData(zresponse);
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail8.vue:907", "Error getting Z amplitude Data: ", error2);
        });
        if (curAxisIndex.value === 0) {
          amplitudeChartData.value = amplitudeXData.value;
        } else if (curAxisIndex.value === 1) {
          amplitudeChartData.value = amplitudeYData.value;
        } else if (curAxisIndex.value === 2) {
          amplitudeChartData.value = amplitudeZData.value;
        }
        getChartInfo();
      };
      const processAmpData = (originalData) => {
        let intervals = originalData.frequencyInterval;
        let roundedIntervals = intervals.map((num) => Math.floor(num));
        let resData = {
          categories: roundedIntervals,
          series: [{ name: originalData.direction + "轴", data: originalData.data }]
        };
        return resData;
      };
      const calculateAmplitudePV = (data) => {
        return data.length > 0 ? Math.max(...data) : void 0;
      };
      const calculateAmplitudeRMS = (data) => {
        let sqSum = 0;
        data.forEach((d2) => {
          sqSum += d2 * d2;
        });
        return data.length > 0 ? Math.sqrt(sqSum - data[0] * data[0] / 2 - data[data.length - 1] * data[data.length - 1] / 2) : void 0;
      };
      let curAxisIndex = vue.ref(0);
      const axisOrder = ["X轴", "Y轴", "Z轴"];
      let axisSelectList = vue.ref([
        { name: "X轴", disabled: false },
        { name: "Y轴", disabled: false },
        { name: "Z轴", disabled: false }
      ]);
      let axisSelectValue = vue.ref("X轴");
      let timeChartInfo = vue.ref(`时程曲线${axisOrder[curAxisIndex.value]}`);
      let ampChartInfo = vue.ref(`频谱曲线${axisOrder[curAxisIndex.value]}`);
      const axisRadioChange = (e2) => {
        changeAxis(e2);
      };
      const changeAxis = (axis) => {
        if (axis === "X轴") {
          curAxisIndex.value = 0;
          timeChartData.value = timeXData.value;
          amplitudeChartData.value = amplitudeXData.value;
        } else if (axis === "Y轴") {
          curAxisIndex.value = 1;
          timeChartData.value = timeYData.value;
          amplitudeChartData.value = amplitudeYData.value;
        } else if (axis === "Z轴") {
          curAxisIndex.value = 2;
          timeChartData.value = timeZData.value;
          amplitudeChartData.value = amplitudeZData.value;
        }
        isTimeLoading.value = true;
        isAmpLoading.value = true;
        setTimeout(() => {
          isTimeLoading.value = false;
          isAmpLoading.value = false;
        }, 1e3);
      };
      const getChartInfo = () => {
        timeChartInfo.value = `时程曲线${axisOrder[curAxisIndex.value]}`;
        ampChartInfo.value = `频谱曲线${axisOrder[curAxisIndex.value]}`;
        if (!isLastDegree.value) {
          if (isValid.value)
            timeChartInfo.value += `-有效值:${timeDataRMS.value[curAxisIndex.value]}`, ampChartInfo.value += `-有效值:${amplitudeDataRMS.value[curAxisIndex.value]}`;
          if (isPeak.value)
            timeChartInfo.value += `-峰值:${timeDataPV.value[curAxisIndex.value]}`, ampChartInfo.value += `-峰值:${amplitudeDataPV.value[curAxisIndex.value]}`;
        } else {
          if (isValid.value)
            timeChartInfo.value += `-有效值:${lastTimeDataRMS.value[curAxisIndex.value]}`, ampChartInfo.value += `-有效值:${amplitudeDataRMS.value[curAxisIndex.value]}`;
          if (isPeak.value)
            timeChartInfo.value += `-峰值:${lastTimeDataPV.value[curAxisIndex.value]}`, ampChartInfo.value += `-峰值:${amplitudeDataPV.value[curAxisIndex.value]}`;
        }
      };
      let lastTimeAnomalyStamp = vue.ref(0);
      let lastAmpAnomalyStamp = vue.ref(0);
      const calculateTimeRatio = (anomalyData) => {
        let r2 = anomalyData / timeDataThreshold.value - 1;
        if (r2 >= 0 && r2 <= 1)
          return 1;
        else if (r2 > 1 && r2 <= 2)
          return 2;
        else if (r2 > 2 && r2 <= 3)
          return 3;
        else
          return 4;
      };
      const checkTimeData = (originalData) => {
        for (let index = 0; index < originalData.data.length; index++) {
          const t_data = originalData.data[index];
          const stamp = Date.now();
          if (t_data > timeDataThreshold.value) {
            let urg = calculateTimeRatio(t_data);
            let exceptionTimeData = {
              time: originalData.sdata + index * 8,
              direction: originalData.direction,
              device: originalData.device,
              data: t_data,
              urgency: urg,
              threshold: timeDataThreshold.value
            };
            if (urg >= 2 && stamp - lastTimeAnomalyStamp.value > anomalyGap$2) {
              lastTimeAnomalyStamp.value = stamp;
              uni.showModal({
                title: "异常预警",
                content: "时程数据异常，预警信息已发送。",
                showCancel: false,
                confirmText: "好的",
                success: () => {
                }
              });
              saveExceptionTimeData(exceptionTimeData);
              return;
            }
          }
        }
      };
      const saveExceptionTimeData = async (exceptionData) => {
        PostTimeDataAnomaly(exceptionData).then((res) => {
          formatAppLog("log", "at pages/index/SensorDetail8.vue:1093", "PostTimeAnomaly response: ", res);
          formatAppLog("log", "at pages/index/SensorDetail8.vue:1094", "Successfully uploaded time exceptional data.");
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail8.vue:1097", "Error post time excetional data: ", error2);
        });
      };
      const calculateAmpRatio = (anomalyData) => {
        let r2 = anomalyData / ampDataThreshold.value - 1;
        if (r2 >= 0 && r2 <= 1)
          return 1;
        else if (r2 > 1 && r2 <= 2)
          return 2;
        else if (r2 > 2 && r2 <= 3)
          return 3;
        else
          return 4;
      };
      const checkAmpData = (originalData) => {
        for (let index = 0; index < originalData.data.length; index++) {
          const a_data = originalData.data[index];
          const stamp = Date.now();
          if (a_data > ampDataThreshold.value) {
            let urg = calculateAmpRatio(a_data);
            let exceptionAmpData = {
              time: originalData.fdata,
              // 频谱默认传回结束时间
              direction: originalData.direction,
              device: originalData.device,
              frequency_interval: originalData.frequencyInterval[index],
              data: a_data,
              urgency: urg,
              threshold: ampDataThreshold.value
            };
            if (urg >= 2 && stamp - lastAmpAnomalyStamp.value > anomalyGap$2) {
              lastAmpAnomalyStamp.value = stamp;
              uni.showModal({
                title: "异常预警",
                content: "频谱数据异常，预警信息已发送。",
                showCancel: false,
                confirmText: "好的",
                success: () => {
                }
              });
              saveExceptionAmpData(exceptionAmpData);
              return;
            }
          }
        }
      };
      const saveExceptionAmpData = async (exceptionData) => {
        PostAmplitudeDataAnomaly(exceptionData).then((res) => {
          formatAppLog("log", "at pages/index/SensorDetail8.vue:1164", "PostAmplitudeAnomaly response: ", res);
          formatAppLog("log", "at pages/index/SensorDetail8.vue:1165", "Successfully uploaded amplitude exceptional data.");
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail8.vue:1168", "Error post amplitude excetional data: ", error2);
        });
      };
      let timeDataIntervalId;
      let ampDataIntervalId;
      let lastDegDataItvlId;
      let timeDataInterval = 1e3;
      let ampDataInterval = 1e3;
      let lastDegDataItv = 1e3;
      onLoad((options) => {
        selectedDeviceId.value = options.device;
      });
      onShow(() => {
        getAllDevices();
        lastDegDataItvlId = setInterval(getLastTimeData, lastDegDataItv);
        timeDataIntervalId = setInterval(getTimeData, timeDataInterval);
        ampDataIntervalId = setInterval(getAmplitudeData, ampDataInterval);
      });
      onUnload(() => {
        clearInterval(timeDataIntervalId);
        clearInterval(ampDataIntervalId);
      });
      const __returned__ = { settingsVisible, isValid, isPeak, timeLimitValue, ampLimitValue, toggleSettings, handleSwitchChange, confirmTimeLimitInput, confirmAmpLimitInput, toast: toast2, showModal, get allDevices() {
        return allDevices;
      }, set allDevices(v2) {
        allDevices = v2;
      }, get selectedDeviceId() {
        return selectedDeviceId;
      }, set selectedDeviceId(v2) {
        selectedDeviceId = v2;
      }, getAllDevices, get selectedDegree() {
        return selectedDegree;
      }, set selectedDegree(v2) {
        selectedDegree = v2;
      }, get selectedTableName() {
        return selectedTableName;
      }, set selectedTableName(v2) {
        selectedTableName = v2;
      }, get selectedInterval() {
        return selectedInterval;
      }, set selectedInterval(v2) {
        selectedInterval = v2;
      }, get degreeSelectList() {
        return degreeSelectList;
      }, set degreeSelectList(v2) {
        degreeSelectList = v2;
      }, get degreeSelectValue() {
        return degreeSelectValue;
      }, set degreeSelectValue(v2) {
        degreeSelectValue = v2;
      }, get isTimeLoading() {
        return isTimeLoading;
      }, set isTimeLoading(v2) {
        isTimeLoading = v2;
      }, get isAmpLoading() {
        return isAmpLoading;
      }, set isAmpLoading(v2) {
        isAmpLoading = v2;
      }, get lastCount() {
        return lastCount;
      }, set lastCount(v2) {
        lastCount = v2;
      }, secondItv: secondItv$2, minuteItv: minuteItv$2, hourItv: hourItv$2, dayItv: dayItv$2, monthItv: monthItv$2, yearItv: yearItv$2, degreeRadioChange, get isLastDegree() {
        return isLastDegree;
      }, set isLastDegree(v2) {
        isLastDegree = v2;
      }, get lastXData() {
        return lastXData;
      }, set lastXData(v2) {
        lastXData = v2;
      }, get lastYData() {
        return lastYData;
      }, set lastYData(v2) {
        lastYData = v2;
      }, get lastZData() {
        return lastZData;
      }, set lastZData(v2) {
        lastZData = v2;
      }, get lastTimeDataRMS() {
        return lastTimeDataRMS;
      }, set lastTimeDataRMS(v2) {
        lastTimeDataRMS = v2;
      }, get lastTimeDataPV() {
        return lastTimeDataPV;
      }, set lastTimeDataPV(v2) {
        lastTimeDataPV = v2;
      }, toLastDegree, toDataNow, getLastTimeData, adjustTimeYAxis, transformTimeStamp, transLastStamp, padZero, caculateTimeList, get timeXData() {
        return timeXData;
      }, set timeXData(v2) {
        timeXData = v2;
      }, get timeYData() {
        return timeYData;
      }, set timeYData(v2) {
        timeYData = v2;
      }, get timeZData() {
        return timeZData;
      }, set timeZData(v2) {
        timeZData = v2;
      }, get timeChartData() {
        return timeChartData;
      }, set timeChartData(v2) {
        timeChartData = v2;
      }, get timeDataRMS() {
        return timeDataRMS;
      }, set timeDataRMS(v2) {
        timeDataRMS = v2;
      }, get timeDataPV() {
        return timeDataPV;
      }, set timeDataPV(v2) {
        timeDataPV = v2;
      }, get timeDataThreshold() {
        return timeDataThreshold;
      }, set timeDataThreshold(v2) {
        timeDataThreshold = v2;
      }, get timeChartMin() {
        return timeChartMin;
      }, set timeChartMin(v2) {
        timeChartMin = v2;
      }, get timeChartMax() {
        return timeChartMax;
      }, set timeChartMax(v2) {
        timeChartMax = v2;
      }, get timeChartFormat() {
        return timeChartFormat;
      }, set timeChartFormat(v2) {
        timeChartFormat = v2;
      }, get timeChartOpts() {
        return timeChartOpts;
      }, set timeChartOpts(v2) {
        timeChartOpts = v2;
      }, getTimeData, processTimeData, calculateTimePV, calculateTimeRMS, get amplitudeXData() {
        return amplitudeXData;
      }, set amplitudeXData(v2) {
        amplitudeXData = v2;
      }, get amplitudeYData() {
        return amplitudeYData;
      }, set amplitudeYData(v2) {
        amplitudeYData = v2;
      }, get amplitudeZData() {
        return amplitudeZData;
      }, set amplitudeZData(v2) {
        amplitudeZData = v2;
      }, get amplitudeChartData() {
        return amplitudeChartData;
      }, set amplitudeChartData(v2) {
        amplitudeChartData = v2;
      }, get amplitudeDataRMS() {
        return amplitudeDataRMS;
      }, set amplitudeDataRMS(v2) {
        amplitudeDataRMS = v2;
      }, get amplitudeDataPV() {
        return amplitudeDataPV;
      }, set amplitudeDataPV(v2) {
        amplitudeDataPV = v2;
      }, get ampDataThreshold() {
        return ampDataThreshold;
      }, set ampDataThreshold(v2) {
        ampDataThreshold = v2;
      }, get amplitudeChartOpts() {
        return amplitudeChartOpts;
      }, set amplitudeChartOpts(v2) {
        amplitudeChartOpts = v2;
      }, getAmplitudeData, processAmpData, calculateAmplitudePV, calculateAmplitudeRMS, get curAxisIndex() {
        return curAxisIndex;
      }, set curAxisIndex(v2) {
        curAxisIndex = v2;
      }, axisOrder, get axisSelectList() {
        return axisSelectList;
      }, set axisSelectList(v2) {
        axisSelectList = v2;
      }, get axisSelectValue() {
        return axisSelectValue;
      }, set axisSelectValue(v2) {
        axisSelectValue = v2;
      }, get timeChartInfo() {
        return timeChartInfo;
      }, set timeChartInfo(v2) {
        timeChartInfo = v2;
      }, get ampChartInfo() {
        return ampChartInfo;
      }, set ampChartInfo(v2) {
        ampChartInfo = v2;
      }, axisRadioChange, changeAxis, getChartInfo, get lastTimeAnomalyStamp() {
        return lastTimeAnomalyStamp;
      }, set lastTimeAnomalyStamp(v2) {
        lastTimeAnomalyStamp = v2;
      }, get lastAmpAnomalyStamp() {
        return lastAmpAnomalyStamp;
      }, set lastAmpAnomalyStamp(v2) {
        lastAmpAnomalyStamp = v2;
      }, anomalyGap: anomalyGap$2, calculateTimeRatio, checkTimeData, saveExceptionTimeData, calculateAmpRatio, checkAmpData, saveExceptionAmpData, get timeDataIntervalId() {
        return timeDataIntervalId;
      }, set timeDataIntervalId(v2) {
        timeDataIntervalId = v2;
      }, get ampDataIntervalId() {
        return ampDataIntervalId;
      }, set ampDataIntervalId(v2) {
        ampDataIntervalId = v2;
      }, get lastDegDataItvlId() {
        return lastDegDataItvlId;
      }, set lastDegDataItvlId(v2) {
        lastDegDataItvlId = v2;
      }, get timeDataInterval() {
        return timeDataInterval;
      }, set timeDataInterval(v2) {
        timeDataInterval = v2;
      }, get ampDataInterval() {
        return ampDataInterval;
      }, set ampDataInterval(v2) {
        ampDataInterval = v2;
      }, get lastDegDataItv() {
        return lastDegDataItv;
      }, set lastDegDataItv(v2) {
        lastDegDataItv = v2;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_toast = resolveEasycom(vue.resolveDynamicComponent("u-toast"), __easycom_0$5);
    const _component_u_modal = resolveEasycom(vue.resolveDynamicComponent("u-modal"), __easycom_1$1);
    const _component_u_switch = resolveEasycom(vue.resolveDynamicComponent("u-switch"), __easycom_2);
    const _component_u_input = resolveEasycom(vue.resolveDynamicComponent("u-input"), __easycom_3);
    const _component_u_radio = resolveEasycom(vue.resolveDynamicComponent("u-radio"), __easycom_4);
    const _component_u_radio_group = resolveEasycom(vue.resolveDynamicComponent("u-radio-group"), __easycom_5);
    const _component_u_button = resolveEasycom(vue.resolveDynamicComponent("u-button"), __easycom_6);
    const _component_qiun_data_charts = resolveEasycom(vue.resolveDynamicComponent("qiun-data-charts"), __easycom_7);
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 弹窗提示 "),
      vue.createVNode(
        _component_u_toast,
        { ref: "toast" },
        null,
        512
        /* NEED_PATCH */
      ),
      vue.createVNode(_component_u_modal, {
        modelValue: $setup.showModal,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.showModal = $event),
        duration: 1e3,
        class: "custom-modal"
      }, {
        default: vue.withCtx(() => [
          vue.createTextVNode("建议您横屏观看效果更佳")
        ]),
        _: 1
        /* STABLE */
      }, 8, ["modelValue"]),
      vue.createCommentVNode(" 设置侧边栏 "),
      $setup.settingsVisible ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "settings-sidebar"
      }, [
        vue.createCommentVNode('\r\n			<view class="settings-header">\n		    <u-icon name="arrow-right" size="30" @click="toggleSettings"></u-icon>\n			</view> \r\n		'),
        vue.createElementVNode("view", { class: "settings-content" }, [
          vue.createElementVNode("view", { class: "settings-item" }, [
            vue.createVNode(_component_u_switch, {
              modelValue: $setup.isValid,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.isValid = $event),
              onChange: _cache[2] || (_cache[2] = ($event) => $setup.handleSwitchChange("isValid", $event))
            }, null, 8, ["modelValue"]),
            vue.createElementVNode("text", null, "有效值")
          ]),
          vue.createElementVNode("view", { class: "settings-item" }, [
            vue.createVNode(_component_u_switch, {
              modelValue: $setup.isPeak,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.isPeak = $event),
              onChange: _cache[4] || (_cache[4] = ($event) => $setup.handleSwitchChange("isPeak", $event))
            }, null, 8, ["modelValue"]),
            vue.createElementVNode("text", null, "峰值")
          ]),
          vue.createElementVNode("view", { class: "settings-item" }, [
            vue.createVNode(_component_u_input, {
              modelValue: $setup.timeLimitValue,
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.timeLimitValue = $event),
              type: "number",
              placeholder: "请输入时程阈值",
              onBlur: $setup.confirmTimeLimitInput
            }, null, 8, ["modelValue"])
          ]),
          vue.createElementVNode("view", { class: "settings-item" }, [
            vue.createVNode(_component_u_input, {
              modelValue: $setup.ampLimitValue,
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.ampLimitValue = $event),
              type: "number",
              placeholder: "请输入频谱阈值",
              onBlur: $setup.confirmAmpLimitInput
            }, null, 8, ["modelValue"])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 分度值选择和历史数据查看 "),
      vue.createElementVNode("view", { class: "controlbar" }, [
        vue.createVNode(_component_u_radio_group, {
          modelValue: $setup.degreeSelectValue,
          "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.degreeSelectValue = $event)
        }, {
          default: vue.withCtx(() => [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.degreeSelectList, (item, index) => {
                return vue.openBlock(), vue.createBlock(_component_u_radio, {
                  onChange: $setup.degreeRadioChange,
                  key: index,
                  name: item.name,
                  disabled: item.disabled
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(
                      vue.toDisplayString(item.name),
                      1
                      /* TEXT */
                    )
                  ]),
                  _: 2
                  /* DYNAMIC */
                }, 1032, ["name", "disabled"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"]),
        vue.createElementVNode("view", { class: "last-degree-buttons" }, [
          !$setup.isLastDegree && ($setup.selectedDegree === "日" || $setup.selectedDegree === "月" || $setup.selectedDegree === "年") ? (vue.openBlock(), vue.createBlock(_component_u_button, {
            key: 0,
            class: "last-degree-button",
            onClick: $setup.toLastDegree
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(
                "◀ 查看上一" + vue.toDisplayString($setup.selectedDegree),
                1
                /* TEXT */
              )
            ]),
            _: 1
            /* STABLE */
          })) : vue.createCommentVNode("v-if", true),
          $setup.isLastDegree ? (vue.openBlock(), vue.createBlock(_component_u_button, {
            key: 1,
            class: "last-degree-button",
            onClick: $setup.toLastDegree
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(
                "◀ 查看上一" + vue.toDisplayString($setup.selectedDegree),
                1
                /* TEXT */
              )
            ]),
            _: 1
            /* STABLE */
          })) : vue.createCommentVNode("v-if", true),
          $setup.isLastDegree ? (vue.openBlock(), vue.createBlock(_component_u_button, {
            key: 2,
            class: "last-degree-button",
            onClick: _cache[8] || (_cache[8] = ($event) => $setup.toDataNow($setup.selectedDegree))
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(
                "回到当前" + vue.toDisplayString($setup.selectedDegree) + " ▶",
                1
                /* TEXT */
              )
            ]),
            _: 1
            /* STABLE */
          })) : vue.createCommentVNode("v-if", true)
        ])
      ]),
      vue.createCommentVNode(" 数据图表 "),
      vue.createElementVNode("view", { class: "dashboard-cards" }, [
        vue.createElementVNode("view", { class: "chart-info" }, [
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($setup.timeChartInfo),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "card" }, [
          $setup.isTimeLoading ? (vue.openBlock(), vue.createBlock(_component_qiun_data_charts, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_qiun_data_charts, {
            key: 1,
            type: "line",
            opts: $setup.timeChartOpts,
            chartData: $setup.timeChartData,
            loadingType: 0
          }, null, 8, ["opts", "chartData"]))
        ]),
        vue.createElementVNode("view", { class: "chart-info" }, [
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($setup.ampChartInfo),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "card" }, [
          $setup.isAmpLoading ? (vue.openBlock(), vue.createBlock(_component_qiun_data_charts, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_qiun_data_charts, {
            key: 1,
            type: "line",
            opts: $setup.amplitudeChartOpts,
            chartData: $setup.amplitudeChartData,
            loadingType: 0
          }, null, 8, ["opts", "chartData"]))
        ])
      ]),
      vue.createCommentVNode(" X、Y、Z 轴切换按钮 "),
      vue.createElementVNode("view", { class: "controlbar" }, [
        vue.createVNode(_component_u_radio_group, {
          modelValue: $setup.axisSelectValue,
          "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $setup.axisSelectValue = $event)
        }, {
          default: vue.withCtx(() => [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.axisSelectList, (item, index) => {
                return vue.openBlock(), vue.createBlock(_component_u_radio, {
                  onChange: $setup.axisRadioChange,
                  key: index,
                  name: item.name,
                  disabled: item.disabled
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(
                      vue.toDisplayString(item.name),
                      1
                      /* TEXT */
                    )
                  ]),
                  _: 2
                  /* DYNAMIC */
                }, 1032, ["name", "disabled"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"])
      ])
    ]);
  }
  const PagesIndexSensorDetail8 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-c4f30aa5"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/pages/index/SensorDetail8.vue"]]);
  const secondItv$1 = 8;
  const minuteItv$1 = 480;
  const hourItv$1 = 28800;
  const dayItv$1 = 86400;
  const monthItv$1 = 24e5;
  const yearItv$1 = 288e5;
  const anomalyGap$1 = 3e5;
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    __name: "SensorDetail9",
    setup(__props, { expose: __expose }) {
      __expose();
      const settingsVisible = vue.ref(false);
      const isValid = vue.ref(true);
      const isPeak = vue.ref(true);
      const timeLimitValue = vue.ref();
      const ampLimitValue = vue.ref();
      const toggleSettings = () => {
        settingsVisible.value = !settingsVisible.value;
      };
      const handleSwitchChange = (key, event) => {
        getChartInfo();
      };
      onNavigationBarButtonTap((e2) => {
        settingsVisible.value = !settingsVisible.value;
      });
      const confirmTimeLimitInput = () => {
        if (timeLimitValue.value) {
          if (timeLimitValue.value <= 0) {
            uni.showModal({
              title: "提示",
              content: "时程阈值应为正数，请重新输入。",
              showCancel: false,
              confirmText: "好的",
              success: () => {
                timeLimitValue.value = null;
              }
            });
          } else {
            timeChartOpts.value.extra.markLine.data[1].value = timeLimitValue.value;
            timeChartOpts.value.extra.markLine.data[2].value = -timeLimitValue.value;
            timeDataThreshold.value = timeLimitValue.value;
          }
        }
      };
      const confirmAmpLimitInput = () => {
        if (ampLimitValue.value) {
          if (ampLimitValue.value <= 0) {
            uni.showModal({
              title: "提示",
              content: "频谱阈值应为正数，请重新输入。",
              showCancel: false,
              confirmText: "好的",
              success: () => {
                ampLimitValue.value = null;
              }
            });
          } else {
            amplitudeChartOpts.value.extra.markLine.data[0].value = ampLimitValue.value;
            ampDataThreshold.value = ampLimitValue.value;
          }
        }
      };
      const toast2 = vue.ref(null);
      const showModal = vue.ref(true);
      let allDevices = vue.ref([]);
      let selectedDeviceId = vue.ref("");
      const getAllDevices = async () => {
        GetAllDevices().then((res) => {
          allDevices.value = res.data;
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail9.vue:266", "Error getting all devices: ", error2);
        });
      };
      let selectedDegree = vue.ref("秒");
      let selectedTableName = vue.ref("time_series");
      let selectedInterval = vue.ref(8);
      let degreeSelectList = vue.ref([
        { name: "秒", disabled: false },
        { name: "分", disabled: false },
        { name: "时", disabled: false },
        { name: "日", disabled: false },
        { name: "月", disabled: false },
        { name: "年", disabled: false }
      ]);
      let degreeSelectValue = vue.ref("秒");
      let isTimeLoading = vue.ref(false);
      let isAmpLoading = vue.ref(false);
      let lastCount = vue.ref(0);
      const degreeRadioChange = (e2) => {
        isLastDegree.value = false;
        lastCount.value = 0;
        selectedDegree.value = e2;
        if (e2 === "秒") {
          selectedTableName.value = "time_series";
          selectedInterval.value = secondItv$1;
        } else if (e2 === "分") {
          selectedTableName.value = "time_series_minutes";
          selectedInterval.value = minuteItv$1;
        } else if (e2 === "时") {
          selectedTableName.value = "time_series_hours";
          selectedInterval.value = hourItv$1;
        } else if (e2 === "日") {
          selectedTableName.value = "time_series_days";
          selectedInterval.value = dayItv$1;
        } else if (e2 === "月") {
          selectedTableName.value = "time_series_months";
          selectedInterval.value = monthItv$1;
        } else if (e2 === "年") {
          selectedTableName.value = "time_series_years";
          selectedInterval.value = yearItv$1;
        } else {
          formatAppLog("error", "at pages/index/SensorDetail9.vue:360", "radioChange failed!");
        }
        isTimeLoading.value = true;
        setTimeout(() => {
          isTimeLoading.value = false;
        }, 2e3);
        adjustTimeYAxis();
      };
      let isLastDegree = vue.ref(false);
      let lastXData = vue.ref([]);
      let lastYData = vue.ref([]);
      let lastZData = vue.ref([]);
      let lastTimeDataRMS = vue.ref([0, 0, 0]);
      let lastTimeDataPV = vue.ref([0, 0, 0]);
      const toLastDegree = () => {
        isLastDegree.value = true;
        lastCount.value += 1;
        isTimeLoading.value = true;
        setTimeout(() => {
          isTimeLoading.value = false;
        }, 1500);
      };
      const toDataNow = () => {
        isLastDegree.value = false;
        lastCount.value = 0;
        isTimeLoading.value = true;
        setTimeout(() => {
          isTimeLoading.value = false;
        }, 1e3);
      };
      const getLastTimeData = async () => {
        let timeStamp = transLastStamp(107, selectedTableName.value);
        if (timeStamp === 0) {
          let dataNum = 0;
          let gap = 0;
          let timeSeriesData;
          let response;
          if (selectedTableName.value === "time_series_months")
            dataNum = 1080, gap = 2592e6;
          else if (selectedTableName.value === "time_series_years")
            dataNum = 1095, gap = 31536e6;
          timeSeriesData = new Array(dataNum).fill(null);
          response = {
            categories: caculateTimeList(17355744e5 - lastCount.value * gap, selectedInterval.value),
            series: [{ name: axisOrder[curAxisIndex.value], data: timeSeriesData }]
          };
          lastXData.value = JSON.parse(JSON.stringify(response));
          lastYData.value = JSON.parse(JSON.stringify(processTimeData(response)));
          lastZData.value = JSON.parse(JSON.stringify(processTimeData(response)));
          lastTimeDataRMS.value[0] = 0;
          lastTimeDataRMS.value[1] = 0;
          lastTimeDataRMS.value[2] = 0;
          lastTimeDataPV.value[0] = 0;
          lastTimeDataPV.value[1] = 0;
          lastTimeDataPV.value[2] = 0;
        }
        GetTimeXData(timeStamp, selectedDeviceId.value, selectedTableName.value).then((res) => {
          let xresponse = res.data;
          lastXData.value = JSON.parse(JSON.stringify(processTimeData(xresponse)));
          lastTimeDataRMS.value[0] = parseFloat(calculateTimeRMS(xresponse.data).toFixed(6));
          lastTimeDataPV.value[0] = parseFloat(calculateTimePV(xresponse.data).toFixed(6));
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail9.vue:436", "Error getting X last Data: " + selectedTableName.value, error2);
        });
        GetTimeYData(timeStamp, selectedDeviceId.value, selectedTableName.value).then((res) => {
          let yresponse = res.data;
          lastYData.value = JSON.parse(JSON.stringify(processTimeData(yresponse)));
          lastTimeDataRMS.value[1] = parseFloat(calculateTimeRMS(yresponse.data).toFixed(6));
          lastTimeDataPV.value[1] = parseFloat(calculateTimePV(yresponse.data).toFixed(6));
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail9.vue:448", "Error getting Y last Data: " + selectedTableName.value, error2);
        });
        GetTimeZData(timeStamp, selectedDeviceId.value, selectedTableName.value).then((res) => {
          let zresponse = res.data;
          lastZData.value = JSON.parse(JSON.stringify(processTimeData(zresponse)));
          lastTimeDataRMS.value[2] = parseFloat(calculateTimeRMS(zresponse.data).toFixed(6));
          lastTimeDataPV.value[2] = parseFloat(calculateTimePV(zresponse.data).toFixed(6));
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail9.vue:460", "Error getting Z last Data: " + selectedTableName.value, error2);
        });
        if (isLastDegree.value) {
          if (curAxisIndex.value === 0) {
            timeChartData.value = lastXData.value;
          } else if (curAxisIndex.value === 1) {
            timeChartData.value = lastYData.value;
          } else if (curAxisIndex.value === 2) {
            timeChartData.value = lastZData.value;
          }
        }
      };
      const adjustTimeYAxis = () => {
        if (selectedDegree.value === "秒") {
          timeChartMin.value = -0.2;
          timeChartMax.value = 0.2;
          timeChartFormat.value = "yAxisFix1";
        } else if (selectedDegree.value === "分") {
          timeChartMin.value = -0.03;
          timeChartMax.value = 0.03;
          timeChartFormat.value = "yAxisFix2";
        } else if (selectedDegree.value === "时") {
          timeChartMin.value = -5e-3;
          timeChartMax.value = 5e-3;
          timeChartFormat.value = "yAxisFix3";
        } else if (selectedDegree.value === "日") {
          timeChartMin.value = -1e-3;
          timeChartMax.value = 1e-3;
          timeChartFormat.value = "yAxisFix4";
        } else if (selectedDegree.value === "月") {
          timeChartMin.value = -1e-3;
          timeChartMax.value = 1e-3;
          timeChartFormat.value = "yAxisFix4";
        } else if (selectedDegree.value === "年") {
          timeChartMin.value = -2e-4;
          timeChartMax.value = 2e-4;
          timeChartFormat.value = "yAxisFix5";
        } else {
          formatAppLog("error", "at pages/index/SensorDetail9.vue:502", "radioChange failed!");
        }
        timeChartOpts.value.yAxis.data[0].min = timeChartMin.value;
        timeChartOpts.value.yAxis.data[0].max = timeChartMax.value;
        timeChartOpts.value.yAxis.data[0].format = timeChartFormat.value;
      };
      const transformTimeStamp = (ms2, degree) => {
        if (degree === "time_series") {
          const timeNow = /* @__PURE__ */ new Date();
          const currentHours = timeNow.getHours();
          const currentMinutes = timeNow.getMinutes();
          const currentSeconds = timeNow.getSeconds();
          const timeNew = new Date(2025, 0, 5, currentHours, currentMinutes, currentSeconds + 1, ms2);
          return timeNew.getTime();
        } else if (degree === "time_series_minutes") {
          const timeNow = /* @__PURE__ */ new Date();
          const currentYear = timeNow.getFullYear();
          const currentMonth = timeNow.getMonth();
          const currentDay = timeNow.getDate();
          const currentHours = timeNow.getHours();
          const currentMinutes = timeNow.getMinutes();
          const timeNew = new Date(currentYear, currentMonth, currentDay, currentHours, currentMinutes + 1, 0, ms2);
          return timeNew.getTime();
        } else if (degree === "time_series_hours") {
          const timeNow = /* @__PURE__ */ new Date();
          const currentYear = timeNow.getFullYear();
          const currentMonth = timeNow.getMonth();
          const currentDay = timeNow.getDate();
          const currentHours = timeNow.getHours();
          const timeNew = new Date(currentYear, currentMonth, currentDay, currentHours + 1, 0, 0, ms2);
          return timeNew.getTime();
        } else if (degree === "time_series_days") {
          const timeNow = /* @__PURE__ */ new Date();
          const currentYear = timeNow.getFullYear();
          const currentMonth = timeNow.getMonth();
          const currentDay = timeNow.getDate();
          const timeNew = new Date(currentYear, currentMonth, currentDay + 1, 0, 0, 0, ms2);
          return timeNew.getTime();
        } else if (degree === "time_series_months") {
          return 17382528e5;
        } else if (degree === "time_series_years") {
          return 17671968e5;
        }
        formatAppLog("error", "at pages/index/SensorDetail9.vue:551", "transformTimeStamp failed!");
        return Date.now();
      };
      const transLastStamp = (ms2, degree) => {
        if (degree === "time_series_days") {
          const timeNow = /* @__PURE__ */ new Date();
          const currentYear = timeNow.getFullYear();
          const currentMonth = timeNow.getMonth();
          const currentDay = timeNow.getDate();
          const timeNew = new Date(currentYear, currentMonth, currentDay - lastCount.value + 1, 0, 0, 0, ms2);
          return timeNew.getTime();
        } else if (degree === "time_series_months") {
          if (lastCount.value === 0 || lastCount.value === 1)
            return 17355744e5;
          else
            return 0;
        } else if (degree === "time_series_years") {
          if (lastCount.value === 0 || lastCount.value === 1)
            return 17355744e5;
          else
            return 0;
        }
        return Date.now();
      };
      const padZero = (num) => num.toString().padStart(2, "0");
      const caculateTimeList = (start, interval) => {
        const time_list = [];
        let beijingTimeString = "";
        let i2 = 0;
        let dataNum = 1e3;
        if (interval === monthItv$1)
          dataNum = 1080;
        else if (interval === yearItv$1)
          dataNum = 1095;
        for (; i2 < dataNum; i2++) {
          const date2 = new Date(start + i2 * interval);
          const year = date2.getFullYear();
          const month = date2.getMonth() + 1;
          const day = date2.getDate();
          const hour = (date2.getUTCHours() + 8) % 24;
          const minute = date2.getUTCMinutes();
          const second = date2.getUTCSeconds();
          if (interval === secondItv$1) {
            beijingTimeString = `${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
          } else if (interval === minuteItv$1) {
            beijingTimeString = `${padZero(hour)}:${padZero(minute)}`;
          } else if (interval === hourItv$1) {
            beijingTimeString = `${padZero(hour)}:${padZero(0)}`;
          } else if (interval === dayItv$1) {
            beijingTimeString = `${day}日${padZero(hour)}时`;
          } else if (interval === monthItv$1) {
            beijingTimeString = `${month}月${day}日`;
          } else if (interval === yearItv$1) {
            beijingTimeString = `${year}年${month}月`;
          }
          time_list.push(beijingTimeString);
        }
        return time_list;
      };
      let timeXData = vue.ref([]);
      let timeYData = vue.ref([]);
      let timeZData = vue.ref([]);
      let timeChartData = vue.ref([]);
      let timeDataRMS = vue.ref([0, 0, 0]);
      let timeDataPV = vue.ref([0, 0, 0]);
      let timeDataThreshold = vue.ref(0.2);
      let timeChartMin = vue.ref(-0.3);
      let timeChartMax = vue.ref(0.3);
      let timeChartFormat = vue.ref("yAxisFix2");
      let timeChartOpts = vue.ref({
        dataLabel: false,
        update: true,
        duration: 0,
        dataPointShape: false,
        padding: [20, 30, 0, 5],
        xAxis: { axisLine: false, boundaryGap: "justify", labelCount: 6 },
        yAxis: { gridType: "solid", data: [{ min: timeChartMin.value, max: timeChartMax.value, format: timeChartFormat.value }] },
        extra: { markLine: { data: [
          { value: 0, lineColor: "#000000", showLabel: true, labelOffsetX: -10 },
          // 中轴标记线
          { value: timeDataThreshold.value, lineColor: "#DE4A42", showLabel: true, labelOffsetX: -10 },
          // 正阈值标记线
          { value: -timeDataThreshold.value, lineColor: "#DE4A42", showLabel: true, labelOffsetX: -10 }
          // ### Question 阈值需要负的吗？
        ] } }
      });
      const getTimeData = async () => {
        let timeStamp = transformTimeStamp(107, selectedTableName.value);
        GetTimeXData(timeStamp, selectedDeviceId.value, selectedTableName.value).then((res) => {
          let xresponse = res.data;
          timeXData.value = JSON.parse(JSON.stringify(processTimeData(xresponse)));
          timeDataRMS.value[0] = parseFloat(calculateTimeRMS(xresponse.data).toFixed(6));
          timeDataPV.value[0] = parseFloat(calculateTimePV(xresponse.data).toFixed(6));
          checkTimeData(xresponse);
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail9.vue:667", "Error getting X time Data: ", error2);
        });
        GetTimeYData(timeStamp, selectedDeviceId.value, selectedTableName.value).then((res) => {
          let yresponse = res.data;
          timeYData.value = JSON.parse(JSON.stringify(processTimeData(yresponse)));
          timeDataRMS.value[1] = parseFloat(calculateTimeRMS(yresponse.data).toFixed(6));
          timeDataPV.value[1] = parseFloat(calculateTimePV(yresponse.data).toFixed(6));
          checkTimeData(yresponse);
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail9.vue:698", "Error getting Y time Data: ", error2);
        });
        GetTimeZData(timeStamp, selectedDeviceId.value, selectedTableName.value).then((res) => {
          let zresponse = res.data;
          timeZData.value = JSON.parse(JSON.stringify(processTimeData(zresponse)));
          timeDataRMS.value[2] = parseFloat(calculateTimeRMS(zresponse.data).toFixed(6));
          timeDataPV.value[2] = parseFloat(calculateTimePV(zresponse.data).toFixed(6));
          checkTimeData(zresponse);
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail9.vue:728", "Error getting Z time Data: ", error2);
        });
        if (!isLastDegree.value) {
          if (curAxisIndex.value === 0) {
            timeChartData.value = timeXData.value;
          } else if (curAxisIndex.value === 1) {
            timeChartData.value = timeYData.value;
          } else if (curAxisIndex.value === 2) {
            timeChartData.value = timeZData.value;
          }
        }
        getChartInfo();
      };
      const processTimeData = (originalData) => {
        let timeList = caculateTimeList(originalData.sdata, selectedInterval.value);
        let timeSeriesData;
        if (!isLastDegree.value && selectedTableName.value === "time_series_days") {
          const timeNow = /* @__PURE__ */ new Date();
          const currentYear = timeNow.getFullYear();
          const currentMonth = timeNow.getMonth();
          const currentDay = timeNow.getDate();
          const timeDayBegin = new Date(currentYear, currentMonth, currentDay, 0, 0, 0, 107);
          const dataCount = Math.floor((timeNow.getTime() - timeDayBegin.getTime()) / dayItv$1);
          timeSeriesData = originalData.data.map((item, index) => index < dataCount ? item : null);
        } else if (!isLastDegree.value && selectedTableName.value === "time_series_months") {
          const timeNow = new Date(2025, 0, 6, 0, 0, 0, 107);
          const timeDayBegin = new Date(2025, 0, 1, 0, 0, 0, 107);
          const dataCount = Math.floor((timeNow.getTime() - timeDayBegin.getTime()) / monthItv$1);
          timeSeriesData = originalData.data.map((item, index) => index < dataCount ? item : null);
        } else {
          timeSeriesData = originalData.data;
        }
        let resData = {
          categories: timeList,
          series: [{ name: originalData.direction + "轴", data: timeSeriesData }]
        };
        return resData;
      };
      const calculateTimePV = (data) => {
        return data.length > 0 ? Math.max(...data) : void 0;
      };
      const calculateTimeRMS = (data) => {
        let sqSum = 0;
        data.forEach((d2) => {
          sqSum += d2 * d2;
        });
        return data.length > 0 ? Math.sqrt(sqSum / (data.length + 1)) : void 0;
      };
      let amplitudeXData = vue.ref([]);
      let amplitudeYData = vue.ref([]);
      let amplitudeZData = vue.ref([]);
      let amplitudeChartData = vue.ref([]);
      let amplitudeDataRMS = vue.ref([0, 0, 0]);
      let amplitudeDataPV = vue.ref([0, 0, 0]);
      let ampDataThreshold = vue.ref(0.02);
      let amplitudeChartOpts = vue.ref({
        dataLabel: false,
        update: true,
        duration: 0,
        dataPointShape: false,
        padding: [20, 30, 0, 5],
        xAxis: { boundaryGap: "justify", labelCount: 12 },
        yAxis: { gridType: "solid", data: [{ min: 0, max: 0.03, format: "yAxisFix3" }] },
        extra: { markLine: { data: [
          { value: ampDataThreshold, lineColor: "#DE4A42", showLabel: true, labelOffsetX: -10 }
          // 阈值标记线
        ] } }
      });
      const getAmplitudeData = async () => {
        let timeStamp = transformTimeStamp(0, "time_series");
        GetAmplitudeXData(timeStamp, selectedDeviceId.value).then((res) => {
          let xresponse = res.data;
          amplitudeXData.value = JSON.parse(JSON.stringify(processAmpData(xresponse)));
          amplitudeDataRMS.value[0] = parseFloat(calculateAmplitudeRMS(xresponse.data).toFixed(3));
          amplitudeDataPV.value[0] = parseFloat(calculateAmplitudePV(xresponse.data).toFixed(3));
          checkAmpData(xresponse);
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail9.vue:847", "Error getting X amplitude Data: ", error2);
        });
        GetAmplitudeYData(timeStamp, selectedDeviceId.value).then((res) => {
          let yresponse = res.data;
          amplitudeYData.value = JSON.parse(JSON.stringify(processAmpData(yresponse)));
          amplitudeDataRMS.value[1] = parseFloat(calculateAmplitudeRMS(yresponse.data).toFixed(3));
          amplitudeDataPV.value[1] = parseFloat(calculateAmplitudePV(yresponse.data).toFixed(3));
          checkAmpData(yresponse);
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail9.vue:877", "Error getting Y amplitude Data: ", error2);
        });
        GetAmplitudeZData(timeStamp, selectedDeviceId.value).then((res) => {
          let zresponse = res.data;
          amplitudeZData.value = JSON.parse(JSON.stringify(processAmpData(zresponse)));
          amplitudeDataRMS.value[2] = parseFloat(calculateAmplitudeRMS(zresponse.data).toFixed(3));
          amplitudeDataPV.value[2] = parseFloat(calculateAmplitudePV(zresponse.data).toFixed(3));
          checkAmpData(zresponse);
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail9.vue:907", "Error getting Z amplitude Data: ", error2);
        });
        if (curAxisIndex.value === 0) {
          amplitudeChartData.value = amplitudeXData.value;
        } else if (curAxisIndex.value === 1) {
          amplitudeChartData.value = amplitudeYData.value;
        } else if (curAxisIndex.value === 2) {
          amplitudeChartData.value = amplitudeZData.value;
        }
        getChartInfo();
      };
      const processAmpData = (originalData) => {
        let intervals = originalData.frequencyInterval;
        let roundedIntervals = intervals.map((num) => Math.floor(num));
        let resData = {
          categories: roundedIntervals,
          series: [{ name: originalData.direction + "轴", data: originalData.data }]
        };
        return resData;
      };
      const calculateAmplitudePV = (data) => {
        return data.length > 0 ? Math.max(...data) : void 0;
      };
      const calculateAmplitudeRMS = (data) => {
        let sqSum = 0;
        data.forEach((d2) => {
          sqSum += d2 * d2;
        });
        return data.length > 0 ? Math.sqrt(sqSum - data[0] * data[0] / 2 - data[data.length - 1] * data[data.length - 1] / 2) : void 0;
      };
      let curAxisIndex = vue.ref(0);
      const axisOrder = ["X轴", "Y轴", "Z轴"];
      let axisSelectList = vue.ref([
        { name: "X轴", disabled: false },
        { name: "Y轴", disabled: false },
        { name: "Z轴", disabled: false }
      ]);
      let axisSelectValue = vue.ref("X轴");
      let timeChartInfo = vue.ref(`时程曲线${axisOrder[curAxisIndex.value]}`);
      let ampChartInfo = vue.ref(`频谱曲线${axisOrder[curAxisIndex.value]}`);
      const axisRadioChange = (e2) => {
        changeAxis(e2);
      };
      const changeAxis = (axis) => {
        if (axis === "X轴") {
          curAxisIndex.value = 0;
          timeChartData.value = timeXData.value;
          amplitudeChartData.value = amplitudeXData.value;
        } else if (axis === "Y轴") {
          curAxisIndex.value = 1;
          timeChartData.value = timeYData.value;
          amplitudeChartData.value = amplitudeYData.value;
        } else if (axis === "Z轴") {
          curAxisIndex.value = 2;
          timeChartData.value = timeZData.value;
          amplitudeChartData.value = amplitudeZData.value;
        }
        isTimeLoading.value = true;
        isAmpLoading.value = true;
        setTimeout(() => {
          isTimeLoading.value = false;
          isAmpLoading.value = false;
        }, 1e3);
      };
      const getChartInfo = () => {
        timeChartInfo.value = `时程曲线${axisOrder[curAxisIndex.value]}`;
        ampChartInfo.value = `频谱曲线${axisOrder[curAxisIndex.value]}`;
        if (!isLastDegree.value) {
          if (isValid.value)
            timeChartInfo.value += `-有效值:${timeDataRMS.value[curAxisIndex.value]}`, ampChartInfo.value += `-有效值:${amplitudeDataRMS.value[curAxisIndex.value]}`;
          if (isPeak.value)
            timeChartInfo.value += `-峰值:${timeDataPV.value[curAxisIndex.value]}`, ampChartInfo.value += `-峰值:${amplitudeDataPV.value[curAxisIndex.value]}`;
        } else {
          if (isValid.value)
            timeChartInfo.value += `-有效值:${lastTimeDataRMS.value[curAxisIndex.value]}`, ampChartInfo.value += `-有效值:${amplitudeDataRMS.value[curAxisIndex.value]}`;
          if (isPeak.value)
            timeChartInfo.value += `-峰值:${lastTimeDataPV.value[curAxisIndex.value]}`, ampChartInfo.value += `-峰值:${amplitudeDataPV.value[curAxisIndex.value]}`;
        }
      };
      let lastTimeAnomalyStamp = vue.ref(0);
      let lastAmpAnomalyStamp = vue.ref(0);
      const calculateTimeRatio = (anomalyData) => {
        let r2 = anomalyData / timeDataThreshold.value - 1;
        if (r2 >= 0 && r2 <= 1)
          return 1;
        else if (r2 > 1 && r2 <= 2)
          return 2;
        else if (r2 > 2 && r2 <= 3)
          return 3;
        else
          return 4;
      };
      const checkTimeData = (originalData) => {
        for (let index = 0; index < originalData.data.length; index++) {
          const t_data = originalData.data[index];
          const stamp = Date.now();
          if (t_data > timeDataThreshold.value) {
            let urg = calculateTimeRatio(t_data);
            let exceptionTimeData = {
              time: originalData.sdata + index * 8,
              direction: originalData.direction,
              device: originalData.device,
              data: t_data,
              urgency: urg,
              threshold: timeDataThreshold.value
            };
            if (urg >= 2 && stamp - lastTimeAnomalyStamp.value > anomalyGap$1) {
              lastTimeAnomalyStamp.value = stamp;
              uni.showModal({
                title: "异常预警",
                content: "时程数据异常，预警信息已发送。",
                showCancel: false,
                confirmText: "好的",
                success: () => {
                }
              });
              saveExceptionTimeData(exceptionTimeData);
              return;
            }
          }
        }
      };
      const saveExceptionTimeData = async (exceptionData) => {
        PostTimeDataAnomaly(exceptionData).then((res) => {
          formatAppLog("log", "at pages/index/SensorDetail9.vue:1093", "PostTimeAnomaly response: ", res);
          formatAppLog("log", "at pages/index/SensorDetail9.vue:1094", "Successfully uploaded time exceptional data.");
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail9.vue:1097", "Error post time excetional data: ", error2);
        });
      };
      const calculateAmpRatio = (anomalyData) => {
        let r2 = anomalyData / ampDataThreshold.value - 1;
        if (r2 >= 0 && r2 <= 1)
          return 1;
        else if (r2 > 1 && r2 <= 2)
          return 2;
        else if (r2 > 2 && r2 <= 3)
          return 3;
        else
          return 4;
      };
      const checkAmpData = (originalData) => {
        for (let index = 0; index < originalData.data.length; index++) {
          const a_data = originalData.data[index];
          const stamp = Date.now();
          if (a_data > ampDataThreshold.value) {
            let urg = calculateAmpRatio(a_data);
            let exceptionAmpData = {
              time: originalData.fdata,
              // 频谱默认传回结束时间
              direction: originalData.direction,
              device: originalData.device,
              frequency_interval: originalData.frequencyInterval[index],
              data: a_data,
              urgency: urg,
              threshold: ampDataThreshold.value
            };
            if (urg >= 2 && stamp - lastAmpAnomalyStamp.value > anomalyGap$1) {
              lastAmpAnomalyStamp.value = stamp;
              uni.showModal({
                title: "异常预警",
                content: "频谱数据异常，预警信息已发送。",
                showCancel: false,
                confirmText: "好的",
                success: () => {
                }
              });
              saveExceptionAmpData(exceptionAmpData);
              return;
            }
          }
        }
      };
      const saveExceptionAmpData = async (exceptionData) => {
        PostAmplitudeDataAnomaly(exceptionData).then((res) => {
          formatAppLog("log", "at pages/index/SensorDetail9.vue:1164", "PostAmplitudeAnomaly response: ", res);
          formatAppLog("log", "at pages/index/SensorDetail9.vue:1165", "Successfully uploaded amplitude exceptional data.");
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail9.vue:1168", "Error post amplitude excetional data: ", error2);
        });
      };
      let timeDataIntervalId;
      let ampDataIntervalId;
      let lastDegDataItvlId;
      let timeDataInterval = 1e3;
      let ampDataInterval = 1e3;
      let lastDegDataItv = 1e3;
      onLoad((options) => {
        selectedDeviceId.value = options.device;
      });
      onShow(() => {
        getAllDevices();
        lastDegDataItvlId = setInterval(getLastTimeData, lastDegDataItv);
        timeDataIntervalId = setInterval(getTimeData, timeDataInterval);
        ampDataIntervalId = setInterval(getAmplitudeData, ampDataInterval);
      });
      onUnload(() => {
        clearInterval(timeDataIntervalId);
        clearInterval(ampDataIntervalId);
      });
      const __returned__ = { settingsVisible, isValid, isPeak, timeLimitValue, ampLimitValue, toggleSettings, handleSwitchChange, confirmTimeLimitInput, confirmAmpLimitInput, toast: toast2, showModal, get allDevices() {
        return allDevices;
      }, set allDevices(v2) {
        allDevices = v2;
      }, get selectedDeviceId() {
        return selectedDeviceId;
      }, set selectedDeviceId(v2) {
        selectedDeviceId = v2;
      }, getAllDevices, get selectedDegree() {
        return selectedDegree;
      }, set selectedDegree(v2) {
        selectedDegree = v2;
      }, get selectedTableName() {
        return selectedTableName;
      }, set selectedTableName(v2) {
        selectedTableName = v2;
      }, get selectedInterval() {
        return selectedInterval;
      }, set selectedInterval(v2) {
        selectedInterval = v2;
      }, get degreeSelectList() {
        return degreeSelectList;
      }, set degreeSelectList(v2) {
        degreeSelectList = v2;
      }, get degreeSelectValue() {
        return degreeSelectValue;
      }, set degreeSelectValue(v2) {
        degreeSelectValue = v2;
      }, get isTimeLoading() {
        return isTimeLoading;
      }, set isTimeLoading(v2) {
        isTimeLoading = v2;
      }, get isAmpLoading() {
        return isAmpLoading;
      }, set isAmpLoading(v2) {
        isAmpLoading = v2;
      }, get lastCount() {
        return lastCount;
      }, set lastCount(v2) {
        lastCount = v2;
      }, secondItv: secondItv$1, minuteItv: minuteItv$1, hourItv: hourItv$1, dayItv: dayItv$1, monthItv: monthItv$1, yearItv: yearItv$1, degreeRadioChange, get isLastDegree() {
        return isLastDegree;
      }, set isLastDegree(v2) {
        isLastDegree = v2;
      }, get lastXData() {
        return lastXData;
      }, set lastXData(v2) {
        lastXData = v2;
      }, get lastYData() {
        return lastYData;
      }, set lastYData(v2) {
        lastYData = v2;
      }, get lastZData() {
        return lastZData;
      }, set lastZData(v2) {
        lastZData = v2;
      }, get lastTimeDataRMS() {
        return lastTimeDataRMS;
      }, set lastTimeDataRMS(v2) {
        lastTimeDataRMS = v2;
      }, get lastTimeDataPV() {
        return lastTimeDataPV;
      }, set lastTimeDataPV(v2) {
        lastTimeDataPV = v2;
      }, toLastDegree, toDataNow, getLastTimeData, adjustTimeYAxis, transformTimeStamp, transLastStamp, padZero, caculateTimeList, get timeXData() {
        return timeXData;
      }, set timeXData(v2) {
        timeXData = v2;
      }, get timeYData() {
        return timeYData;
      }, set timeYData(v2) {
        timeYData = v2;
      }, get timeZData() {
        return timeZData;
      }, set timeZData(v2) {
        timeZData = v2;
      }, get timeChartData() {
        return timeChartData;
      }, set timeChartData(v2) {
        timeChartData = v2;
      }, get timeDataRMS() {
        return timeDataRMS;
      }, set timeDataRMS(v2) {
        timeDataRMS = v2;
      }, get timeDataPV() {
        return timeDataPV;
      }, set timeDataPV(v2) {
        timeDataPV = v2;
      }, get timeDataThreshold() {
        return timeDataThreshold;
      }, set timeDataThreshold(v2) {
        timeDataThreshold = v2;
      }, get timeChartMin() {
        return timeChartMin;
      }, set timeChartMin(v2) {
        timeChartMin = v2;
      }, get timeChartMax() {
        return timeChartMax;
      }, set timeChartMax(v2) {
        timeChartMax = v2;
      }, get timeChartFormat() {
        return timeChartFormat;
      }, set timeChartFormat(v2) {
        timeChartFormat = v2;
      }, get timeChartOpts() {
        return timeChartOpts;
      }, set timeChartOpts(v2) {
        timeChartOpts = v2;
      }, getTimeData, processTimeData, calculateTimePV, calculateTimeRMS, get amplitudeXData() {
        return amplitudeXData;
      }, set amplitudeXData(v2) {
        amplitudeXData = v2;
      }, get amplitudeYData() {
        return amplitudeYData;
      }, set amplitudeYData(v2) {
        amplitudeYData = v2;
      }, get amplitudeZData() {
        return amplitudeZData;
      }, set amplitudeZData(v2) {
        amplitudeZData = v2;
      }, get amplitudeChartData() {
        return amplitudeChartData;
      }, set amplitudeChartData(v2) {
        amplitudeChartData = v2;
      }, get amplitudeDataRMS() {
        return amplitudeDataRMS;
      }, set amplitudeDataRMS(v2) {
        amplitudeDataRMS = v2;
      }, get amplitudeDataPV() {
        return amplitudeDataPV;
      }, set amplitudeDataPV(v2) {
        amplitudeDataPV = v2;
      }, get ampDataThreshold() {
        return ampDataThreshold;
      }, set ampDataThreshold(v2) {
        ampDataThreshold = v2;
      }, get amplitudeChartOpts() {
        return amplitudeChartOpts;
      }, set amplitudeChartOpts(v2) {
        amplitudeChartOpts = v2;
      }, getAmplitudeData, processAmpData, calculateAmplitudePV, calculateAmplitudeRMS, get curAxisIndex() {
        return curAxisIndex;
      }, set curAxisIndex(v2) {
        curAxisIndex = v2;
      }, axisOrder, get axisSelectList() {
        return axisSelectList;
      }, set axisSelectList(v2) {
        axisSelectList = v2;
      }, get axisSelectValue() {
        return axisSelectValue;
      }, set axisSelectValue(v2) {
        axisSelectValue = v2;
      }, get timeChartInfo() {
        return timeChartInfo;
      }, set timeChartInfo(v2) {
        timeChartInfo = v2;
      }, get ampChartInfo() {
        return ampChartInfo;
      }, set ampChartInfo(v2) {
        ampChartInfo = v2;
      }, axisRadioChange, changeAxis, getChartInfo, get lastTimeAnomalyStamp() {
        return lastTimeAnomalyStamp;
      }, set lastTimeAnomalyStamp(v2) {
        lastTimeAnomalyStamp = v2;
      }, get lastAmpAnomalyStamp() {
        return lastAmpAnomalyStamp;
      }, set lastAmpAnomalyStamp(v2) {
        lastAmpAnomalyStamp = v2;
      }, anomalyGap: anomalyGap$1, calculateTimeRatio, checkTimeData, saveExceptionTimeData, calculateAmpRatio, checkAmpData, saveExceptionAmpData, get timeDataIntervalId() {
        return timeDataIntervalId;
      }, set timeDataIntervalId(v2) {
        timeDataIntervalId = v2;
      }, get ampDataIntervalId() {
        return ampDataIntervalId;
      }, set ampDataIntervalId(v2) {
        ampDataIntervalId = v2;
      }, get lastDegDataItvlId() {
        return lastDegDataItvlId;
      }, set lastDegDataItvlId(v2) {
        lastDegDataItvlId = v2;
      }, get timeDataInterval() {
        return timeDataInterval;
      }, set timeDataInterval(v2) {
        timeDataInterval = v2;
      }, get ampDataInterval() {
        return ampDataInterval;
      }, set ampDataInterval(v2) {
        ampDataInterval = v2;
      }, get lastDegDataItv() {
        return lastDegDataItv;
      }, set lastDegDataItv(v2) {
        lastDegDataItv = v2;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_toast = resolveEasycom(vue.resolveDynamicComponent("u-toast"), __easycom_0$5);
    const _component_u_modal = resolveEasycom(vue.resolveDynamicComponent("u-modal"), __easycom_1$1);
    const _component_u_switch = resolveEasycom(vue.resolveDynamicComponent("u-switch"), __easycom_2);
    const _component_u_input = resolveEasycom(vue.resolveDynamicComponent("u-input"), __easycom_3);
    const _component_u_radio = resolveEasycom(vue.resolveDynamicComponent("u-radio"), __easycom_4);
    const _component_u_radio_group = resolveEasycom(vue.resolveDynamicComponent("u-radio-group"), __easycom_5);
    const _component_u_button = resolveEasycom(vue.resolveDynamicComponent("u-button"), __easycom_6);
    const _component_qiun_data_charts = resolveEasycom(vue.resolveDynamicComponent("qiun-data-charts"), __easycom_7);
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 弹窗提示 "),
      vue.createVNode(
        _component_u_toast,
        { ref: "toast" },
        null,
        512
        /* NEED_PATCH */
      ),
      vue.createVNode(_component_u_modal, {
        modelValue: $setup.showModal,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.showModal = $event),
        duration: 1e3,
        class: "custom-modal"
      }, {
        default: vue.withCtx(() => [
          vue.createTextVNode("建议您横屏观看效果更佳")
        ]),
        _: 1
        /* STABLE */
      }, 8, ["modelValue"]),
      vue.createCommentVNode(" 设置侧边栏 "),
      $setup.settingsVisible ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "settings-sidebar"
      }, [
        vue.createCommentVNode('\r\n			<view class="settings-header">\n		    <u-icon name="arrow-right" size="30" @click="toggleSettings"></u-icon>\n			</view> \r\n		'),
        vue.createElementVNode("view", { class: "settings-content" }, [
          vue.createElementVNode("view", { class: "settings-item" }, [
            vue.createVNode(_component_u_switch, {
              modelValue: $setup.isValid,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.isValid = $event),
              onChange: _cache[2] || (_cache[2] = ($event) => $setup.handleSwitchChange("isValid", $event))
            }, null, 8, ["modelValue"]),
            vue.createElementVNode("text", null, "有效值")
          ]),
          vue.createElementVNode("view", { class: "settings-item" }, [
            vue.createVNode(_component_u_switch, {
              modelValue: $setup.isPeak,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.isPeak = $event),
              onChange: _cache[4] || (_cache[4] = ($event) => $setup.handleSwitchChange("isPeak", $event))
            }, null, 8, ["modelValue"]),
            vue.createElementVNode("text", null, "峰值")
          ]),
          vue.createElementVNode("view", { class: "settings-item" }, [
            vue.createVNode(_component_u_input, {
              modelValue: $setup.timeLimitValue,
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.timeLimitValue = $event),
              type: "number",
              placeholder: "请输入时程阈值",
              onBlur: $setup.confirmTimeLimitInput
            }, null, 8, ["modelValue"])
          ]),
          vue.createElementVNode("view", { class: "settings-item" }, [
            vue.createVNode(_component_u_input, {
              modelValue: $setup.ampLimitValue,
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.ampLimitValue = $event),
              type: "number",
              placeholder: "请输入频谱阈值",
              onBlur: $setup.confirmAmpLimitInput
            }, null, 8, ["modelValue"])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 分度值选择和历史数据查看 "),
      vue.createElementVNode("view", { class: "controlbar" }, [
        vue.createVNode(_component_u_radio_group, {
          modelValue: $setup.degreeSelectValue,
          "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.degreeSelectValue = $event)
        }, {
          default: vue.withCtx(() => [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.degreeSelectList, (item, index) => {
                return vue.openBlock(), vue.createBlock(_component_u_radio, {
                  onChange: $setup.degreeRadioChange,
                  key: index,
                  name: item.name,
                  disabled: item.disabled
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(
                      vue.toDisplayString(item.name),
                      1
                      /* TEXT */
                    )
                  ]),
                  _: 2
                  /* DYNAMIC */
                }, 1032, ["name", "disabled"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"]),
        vue.createElementVNode("view", { class: "last-degree-buttons" }, [
          !$setup.isLastDegree && ($setup.selectedDegree === "日" || $setup.selectedDegree === "月" || $setup.selectedDegree === "年") ? (vue.openBlock(), vue.createBlock(_component_u_button, {
            key: 0,
            class: "last-degree-button",
            onClick: $setup.toLastDegree
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(
                "◀ 查看上一" + vue.toDisplayString($setup.selectedDegree),
                1
                /* TEXT */
              )
            ]),
            _: 1
            /* STABLE */
          })) : vue.createCommentVNode("v-if", true),
          $setup.isLastDegree ? (vue.openBlock(), vue.createBlock(_component_u_button, {
            key: 1,
            class: "last-degree-button",
            onClick: $setup.toLastDegree
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(
                "◀ 查看上一" + vue.toDisplayString($setup.selectedDegree),
                1
                /* TEXT */
              )
            ]),
            _: 1
            /* STABLE */
          })) : vue.createCommentVNode("v-if", true),
          $setup.isLastDegree ? (vue.openBlock(), vue.createBlock(_component_u_button, {
            key: 2,
            class: "last-degree-button",
            onClick: _cache[8] || (_cache[8] = ($event) => $setup.toDataNow($setup.selectedDegree))
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(
                "回到当前" + vue.toDisplayString($setup.selectedDegree) + " ▶",
                1
                /* TEXT */
              )
            ]),
            _: 1
            /* STABLE */
          })) : vue.createCommentVNode("v-if", true)
        ])
      ]),
      vue.createCommentVNode(" 数据图表 "),
      vue.createElementVNode("view", { class: "dashboard-cards" }, [
        vue.createElementVNode("view", { class: "chart-info" }, [
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($setup.timeChartInfo),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "card" }, [
          $setup.isTimeLoading ? (vue.openBlock(), vue.createBlock(_component_qiun_data_charts, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_qiun_data_charts, {
            key: 1,
            type: "line",
            opts: $setup.timeChartOpts,
            chartData: $setup.timeChartData,
            loadingType: 0
          }, null, 8, ["opts", "chartData"]))
        ]),
        vue.createElementVNode("view", { class: "chart-info" }, [
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($setup.ampChartInfo),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "card" }, [
          $setup.isAmpLoading ? (vue.openBlock(), vue.createBlock(_component_qiun_data_charts, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_qiun_data_charts, {
            key: 1,
            type: "line",
            opts: $setup.amplitudeChartOpts,
            chartData: $setup.amplitudeChartData,
            loadingType: 0
          }, null, 8, ["opts", "chartData"]))
        ])
      ]),
      vue.createCommentVNode(" X、Y、Z 轴切换按钮 "),
      vue.createElementVNode("view", { class: "controlbar" }, [
        vue.createVNode(_component_u_radio_group, {
          modelValue: $setup.axisSelectValue,
          "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $setup.axisSelectValue = $event)
        }, {
          default: vue.withCtx(() => [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.axisSelectList, (item, index) => {
                return vue.openBlock(), vue.createBlock(_component_u_radio, {
                  onChange: $setup.axisRadioChange,
                  key: index,
                  name: item.name,
                  disabled: item.disabled
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(
                      vue.toDisplayString(item.name),
                      1
                      /* TEXT */
                    )
                  ]),
                  _: 2
                  /* DYNAMIC */
                }, 1032, ["name", "disabled"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"])
      ])
    ]);
  }
  const PagesIndexSensorDetail9 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-a770b176"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/pages/index/SensorDetail9.vue"]]);
  const secondItv = 8;
  const minuteItv = 480;
  const hourItv = 28800;
  const dayItv = 86400;
  const monthItv = 24e5;
  const yearItv = 288e5;
  const anomalyGap = 3e5;
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    __name: "SensorDetail10",
    setup(__props, { expose: __expose }) {
      __expose();
      const settingsVisible = vue.ref(false);
      const isValid = vue.ref(true);
      const isPeak = vue.ref(true);
      const timeLimitValue = vue.ref();
      const ampLimitValue = vue.ref();
      const toggleSettings = () => {
        settingsVisible.value = !settingsVisible.value;
      };
      const handleSwitchChange = (key, event) => {
        getChartInfo();
      };
      onNavigationBarButtonTap((e2) => {
        settingsVisible.value = !settingsVisible.value;
      });
      const confirmTimeLimitInput = () => {
        if (timeLimitValue.value) {
          if (timeLimitValue.value <= 0) {
            uni.showModal({
              title: "提示",
              content: "时程阈值应为正数，请重新输入。",
              showCancel: false,
              confirmText: "好的",
              success: () => {
                timeLimitValue.value = null;
              }
            });
          } else {
            timeChartOpts.value.extra.markLine.data[1].value = timeLimitValue.value;
            timeChartOpts.value.extra.markLine.data[2].value = -timeLimitValue.value;
            timeDataThreshold.value = timeLimitValue.value;
          }
        }
      };
      const confirmAmpLimitInput = () => {
        if (ampLimitValue.value) {
          if (ampLimitValue.value <= 0) {
            uni.showModal({
              title: "提示",
              content: "频谱阈值应为正数，请重新输入。",
              showCancel: false,
              confirmText: "好的",
              success: () => {
                ampLimitValue.value = null;
              }
            });
          } else {
            amplitudeChartOpts.value.extra.markLine.data[0].value = ampLimitValue.value;
            ampDataThreshold.value = ampLimitValue.value;
          }
        }
      };
      const toast2 = vue.ref(null);
      const showModal = vue.ref(true);
      let allDevices = vue.ref([]);
      let selectedDeviceId = vue.ref("");
      const getAllDevices = async () => {
        GetAllDevices().then((res) => {
          allDevices.value = res.data;
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail10.vue:266", "Error getting all devices: ", error2);
        });
      };
      let selectedDegree = vue.ref("秒");
      let selectedTableName = vue.ref("time_series");
      let selectedInterval = vue.ref(8);
      let degreeSelectList = vue.ref([
        { name: "秒", disabled: false },
        { name: "分", disabled: false },
        { name: "时", disabled: false },
        { name: "日", disabled: false },
        { name: "月", disabled: false },
        { name: "年", disabled: false }
      ]);
      let degreeSelectValue = vue.ref("秒");
      let isTimeLoading = vue.ref(false);
      let isAmpLoading = vue.ref(false);
      let lastCount = vue.ref(0);
      const degreeRadioChange = (e2) => {
        isLastDegree.value = false;
        lastCount.value = 0;
        selectedDegree.value = e2;
        if (e2 === "秒") {
          selectedTableName.value = "time_series";
          selectedInterval.value = secondItv;
        } else if (e2 === "分") {
          selectedTableName.value = "time_series_minutes";
          selectedInterval.value = minuteItv;
        } else if (e2 === "时") {
          selectedTableName.value = "time_series_hours";
          selectedInterval.value = hourItv;
        } else if (e2 === "日") {
          selectedTableName.value = "time_series_days";
          selectedInterval.value = dayItv;
        } else if (e2 === "月") {
          selectedTableName.value = "time_series_months";
          selectedInterval.value = monthItv;
        } else if (e2 === "年") {
          selectedTableName.value = "time_series_years";
          selectedInterval.value = yearItv;
        } else {
          formatAppLog("error", "at pages/index/SensorDetail10.vue:360", "radioChange failed!");
        }
        isTimeLoading.value = true;
        setTimeout(() => {
          isTimeLoading.value = false;
        }, 2e3);
        adjustTimeYAxis();
      };
      let isLastDegree = vue.ref(false);
      let lastXData = vue.ref([]);
      let lastYData = vue.ref([]);
      let lastZData = vue.ref([]);
      let lastTimeDataRMS = vue.ref([0, 0, 0]);
      let lastTimeDataPV = vue.ref([0, 0, 0]);
      const toLastDegree = () => {
        isLastDegree.value = true;
        lastCount.value += 1;
        isTimeLoading.value = true;
        setTimeout(() => {
          isTimeLoading.value = false;
        }, 1500);
      };
      const toDataNow = () => {
        isLastDegree.value = false;
        lastCount.value = 0;
        isTimeLoading.value = true;
        setTimeout(() => {
          isTimeLoading.value = false;
        }, 1e3);
      };
      const getLastTimeData = async () => {
        let timeStamp = transLastStamp(107, selectedTableName.value);
        if (timeStamp === 0) {
          let dataNum = 0;
          let gap = 0;
          let timeSeriesData;
          let response;
          if (selectedTableName.value === "time_series_months")
            dataNum = 1080, gap = 2592e6;
          else if (selectedTableName.value === "time_series_years")
            dataNum = 1095, gap = 31536e6;
          timeSeriesData = new Array(dataNum).fill(null);
          response = {
            categories: caculateTimeList(17355744e5 - lastCount.value * gap, selectedInterval.value),
            series: [{ name: axisOrder[curAxisIndex.value], data: timeSeriesData }]
          };
          lastXData.value = JSON.parse(JSON.stringify(response));
          lastYData.value = JSON.parse(JSON.stringify(processTimeData(response)));
          lastZData.value = JSON.parse(JSON.stringify(processTimeData(response)));
          lastTimeDataRMS.value[0] = 0;
          lastTimeDataRMS.value[1] = 0;
          lastTimeDataRMS.value[2] = 0;
          lastTimeDataPV.value[0] = 0;
          lastTimeDataPV.value[1] = 0;
          lastTimeDataPV.value[2] = 0;
        }
        GetTimeXData(timeStamp, selectedDeviceId.value, selectedTableName.value).then((res) => {
          let xresponse = res.data;
          lastXData.value = JSON.parse(JSON.stringify(processTimeData(xresponse)));
          lastTimeDataRMS.value[0] = parseFloat(calculateTimeRMS(xresponse.data).toFixed(6));
          lastTimeDataPV.value[0] = parseFloat(calculateTimePV(xresponse.data).toFixed(6));
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail10.vue:436", "Error getting X last Data: " + selectedTableName.value, error2);
        });
        GetTimeYData(timeStamp, selectedDeviceId.value, selectedTableName.value).then((res) => {
          let yresponse = res.data;
          lastYData.value = JSON.parse(JSON.stringify(processTimeData(yresponse)));
          lastTimeDataRMS.value[1] = parseFloat(calculateTimeRMS(yresponse.data).toFixed(6));
          lastTimeDataPV.value[1] = parseFloat(calculateTimePV(yresponse.data).toFixed(6));
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail10.vue:448", "Error getting Y last Data: " + selectedTableName.value, error2);
        });
        GetTimeZData(timeStamp, selectedDeviceId.value, selectedTableName.value).then((res) => {
          let zresponse = res.data;
          lastZData.value = JSON.parse(JSON.stringify(processTimeData(zresponse)));
          lastTimeDataRMS.value[2] = parseFloat(calculateTimeRMS(zresponse.data).toFixed(6));
          lastTimeDataPV.value[2] = parseFloat(calculateTimePV(zresponse.data).toFixed(6));
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail10.vue:460", "Error getting Z last Data: " + selectedTableName.value, error2);
        });
        if (isLastDegree.value) {
          if (curAxisIndex.value === 0) {
            timeChartData.value = lastXData.value;
          } else if (curAxisIndex.value === 1) {
            timeChartData.value = lastYData.value;
          } else if (curAxisIndex.value === 2) {
            timeChartData.value = lastZData.value;
          }
        }
      };
      const adjustTimeYAxis = () => {
        if (selectedDegree.value === "秒") {
          timeChartMin.value = -0.2;
          timeChartMax.value = 0.2;
          timeChartFormat.value = "yAxisFix1";
        } else if (selectedDegree.value === "分") {
          timeChartMin.value = -0.03;
          timeChartMax.value = 0.03;
          timeChartFormat.value = "yAxisFix2";
        } else if (selectedDegree.value === "时") {
          timeChartMin.value = -5e-3;
          timeChartMax.value = 5e-3;
          timeChartFormat.value = "yAxisFix3";
        } else if (selectedDegree.value === "日") {
          timeChartMin.value = -1e-3;
          timeChartMax.value = 1e-3;
          timeChartFormat.value = "yAxisFix4";
        } else if (selectedDegree.value === "月") {
          timeChartMin.value = -1e-3;
          timeChartMax.value = 1e-3;
          timeChartFormat.value = "yAxisFix4";
        } else if (selectedDegree.value === "年") {
          timeChartMin.value = -2e-4;
          timeChartMax.value = 2e-4;
          timeChartFormat.value = "yAxisFix5";
        } else {
          formatAppLog("error", "at pages/index/SensorDetail10.vue:502", "radioChange failed!");
        }
        timeChartOpts.value.yAxis.data[0].min = timeChartMin.value;
        timeChartOpts.value.yAxis.data[0].max = timeChartMax.value;
        timeChartOpts.value.yAxis.data[0].format = timeChartFormat.value;
      };
      const transformTimeStamp = (ms2, degree) => {
        if (degree === "time_series") {
          const timeNow = /* @__PURE__ */ new Date();
          const currentHours = timeNow.getHours();
          const currentMinutes = timeNow.getMinutes();
          const currentSeconds = timeNow.getSeconds();
          const timeNew = new Date(2025, 0, 5, currentHours, currentMinutes, currentSeconds + 1, ms2);
          return timeNew.getTime();
        } else if (degree === "time_series_minutes") {
          const timeNow = /* @__PURE__ */ new Date();
          const currentYear = timeNow.getFullYear();
          const currentMonth = timeNow.getMonth();
          const currentDay = timeNow.getDate();
          const currentHours = timeNow.getHours();
          const currentMinutes = timeNow.getMinutes();
          const timeNew = new Date(currentYear, currentMonth, currentDay, currentHours, currentMinutes + 1, 0, ms2);
          return timeNew.getTime();
        } else if (degree === "time_series_hours") {
          const timeNow = /* @__PURE__ */ new Date();
          const currentYear = timeNow.getFullYear();
          const currentMonth = timeNow.getMonth();
          const currentDay = timeNow.getDate();
          const currentHours = timeNow.getHours();
          const timeNew = new Date(currentYear, currentMonth, currentDay, currentHours + 1, 0, 0, ms2);
          return timeNew.getTime();
        } else if (degree === "time_series_days") {
          const timeNow = /* @__PURE__ */ new Date();
          const currentYear = timeNow.getFullYear();
          const currentMonth = timeNow.getMonth();
          const currentDay = timeNow.getDate();
          const timeNew = new Date(currentYear, currentMonth, currentDay + 1, 0, 0, 0, ms2);
          return timeNew.getTime();
        } else if (degree === "time_series_months") {
          return 17382528e5;
        } else if (degree === "time_series_years") {
          return 17671968e5;
        }
        formatAppLog("error", "at pages/index/SensorDetail10.vue:551", "transformTimeStamp failed!");
        return Date.now();
      };
      const transLastStamp = (ms2, degree) => {
        if (degree === "time_series_days") {
          const timeNow = /* @__PURE__ */ new Date();
          const currentYear = timeNow.getFullYear();
          const currentMonth = timeNow.getMonth();
          const currentDay = timeNow.getDate();
          const timeNew = new Date(currentYear, currentMonth, currentDay - lastCount.value + 1, 0, 0, 0, ms2);
          return timeNew.getTime();
        } else if (degree === "time_series_months") {
          if (lastCount.value === 0 || lastCount.value === 1)
            return 17355744e5;
          else
            return 0;
        } else if (degree === "time_series_years") {
          if (lastCount.value === 0 || lastCount.value === 1)
            return 17355744e5;
          else
            return 0;
        }
        return Date.now();
      };
      const padZero = (num) => num.toString().padStart(2, "0");
      const caculateTimeList = (start, interval) => {
        const time_list = [];
        let beijingTimeString = "";
        let i2 = 0;
        let dataNum = 1e3;
        if (interval === monthItv)
          dataNum = 1080;
        else if (interval === yearItv)
          dataNum = 1095;
        for (; i2 < dataNum; i2++) {
          const date2 = new Date(start + i2 * interval);
          const year = date2.getFullYear();
          const month = date2.getMonth() + 1;
          const day = date2.getDate();
          const hour = (date2.getUTCHours() + 8) % 24;
          const minute = date2.getUTCMinutes();
          const second = date2.getUTCSeconds();
          if (interval === secondItv) {
            beijingTimeString = `${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
          } else if (interval === minuteItv) {
            beijingTimeString = `${padZero(hour)}:${padZero(minute)}`;
          } else if (interval === hourItv) {
            beijingTimeString = `${padZero(hour)}:${padZero(0)}`;
          } else if (interval === dayItv) {
            beijingTimeString = `${day}日${padZero(hour)}时`;
          } else if (interval === monthItv) {
            beijingTimeString = `${month}月${day}日`;
          } else if (interval === yearItv) {
            beijingTimeString = `${year}年${month}月`;
          }
          time_list.push(beijingTimeString);
        }
        return time_list;
      };
      let timeXData = vue.ref([]);
      let timeYData = vue.ref([]);
      let timeZData = vue.ref([]);
      let timeChartData = vue.ref([]);
      let timeDataRMS = vue.ref([0, 0, 0]);
      let timeDataPV = vue.ref([0, 0, 0]);
      let timeDataThreshold = vue.ref(0.2);
      let timeChartMin = vue.ref(-0.3);
      let timeChartMax = vue.ref(0.3);
      let timeChartFormat = vue.ref("yAxisFix2");
      let timeChartOpts = vue.ref({
        dataLabel: false,
        update: true,
        duration: 0,
        dataPointShape: false,
        padding: [20, 30, 0, 5],
        xAxis: { axisLine: false, boundaryGap: "justify", labelCount: 6 },
        yAxis: { gridType: "solid", data: [{ min: timeChartMin.value, max: timeChartMax.value, format: timeChartFormat.value }] },
        extra: { markLine: { data: [
          { value: 0, lineColor: "#000000", showLabel: true, labelOffsetX: -10 },
          // 中轴标记线
          { value: timeDataThreshold.value, lineColor: "#DE4A42", showLabel: true, labelOffsetX: -10 },
          // 正阈值标记线
          { value: -timeDataThreshold.value, lineColor: "#DE4A42", showLabel: true, labelOffsetX: -10 }
          // ### Question 阈值需要负的吗？
        ] } }
      });
      const getTimeData = async () => {
        let timeStamp = transformTimeStamp(107, selectedTableName.value);
        GetTimeXData(timeStamp, selectedDeviceId.value, selectedTableName.value).then((res) => {
          let xresponse = res.data;
          timeXData.value = JSON.parse(JSON.stringify(processTimeData(xresponse)));
          timeDataRMS.value[0] = parseFloat(calculateTimeRMS(xresponse.data).toFixed(6));
          timeDataPV.value[0] = parseFloat(calculateTimePV(xresponse.data).toFixed(6));
          checkTimeData(xresponse);
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail10.vue:667", "Error getting X time Data: ", error2);
        });
        GetTimeYData(timeStamp, selectedDeviceId.value, selectedTableName.value).then((res) => {
          let yresponse = res.data;
          timeYData.value = JSON.parse(JSON.stringify(processTimeData(yresponse)));
          timeDataRMS.value[1] = parseFloat(calculateTimeRMS(yresponse.data).toFixed(6));
          timeDataPV.value[1] = parseFloat(calculateTimePV(yresponse.data).toFixed(6));
          checkTimeData(yresponse);
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail10.vue:698", "Error getting Y time Data: ", error2);
        });
        GetTimeZData(timeStamp, selectedDeviceId.value, selectedTableName.value).then((res) => {
          let zresponse = res.data;
          timeZData.value = JSON.parse(JSON.stringify(processTimeData(zresponse)));
          timeDataRMS.value[2] = parseFloat(calculateTimeRMS(zresponse.data).toFixed(6));
          timeDataPV.value[2] = parseFloat(calculateTimePV(zresponse.data).toFixed(6));
          checkTimeData(zresponse);
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail10.vue:728", "Error getting Z time Data: ", error2);
        });
        if (!isLastDegree.value) {
          if (curAxisIndex.value === 0) {
            timeChartData.value = timeXData.value;
          } else if (curAxisIndex.value === 1) {
            timeChartData.value = timeYData.value;
          } else if (curAxisIndex.value === 2) {
            timeChartData.value = timeZData.value;
          }
        }
        getChartInfo();
      };
      const processTimeData = (originalData) => {
        let timeList = caculateTimeList(originalData.sdata, selectedInterval.value);
        let timeSeriesData;
        if (!isLastDegree.value && selectedTableName.value === "time_series_days") {
          const timeNow = /* @__PURE__ */ new Date();
          const currentYear = timeNow.getFullYear();
          const currentMonth = timeNow.getMonth();
          const currentDay = timeNow.getDate();
          const timeDayBegin = new Date(currentYear, currentMonth, currentDay, 0, 0, 0, 107);
          const dataCount = Math.floor((timeNow.getTime() - timeDayBegin.getTime()) / dayItv);
          timeSeriesData = originalData.data.map((item, index) => index < dataCount ? item : null);
        } else if (!isLastDegree.value && selectedTableName.value === "time_series_months") {
          const timeNow = new Date(2025, 0, 6, 0, 0, 0, 107);
          const timeDayBegin = new Date(2025, 0, 1, 0, 0, 0, 107);
          const dataCount = Math.floor((timeNow.getTime() - timeDayBegin.getTime()) / monthItv);
          timeSeriesData = originalData.data.map((item, index) => index < dataCount ? item : null);
        } else {
          timeSeriesData = originalData.data;
        }
        let resData = {
          categories: timeList,
          series: [{ name: originalData.direction + "轴", data: timeSeriesData }]
        };
        return resData;
      };
      const calculateTimePV = (data) => {
        return data.length > 0 ? Math.max(...data) : void 0;
      };
      const calculateTimeRMS = (data) => {
        let sqSum = 0;
        data.forEach((d2) => {
          sqSum += d2 * d2;
        });
        return data.length > 0 ? Math.sqrt(sqSum / (data.length + 1)) : void 0;
      };
      let amplitudeXData = vue.ref([]);
      let amplitudeYData = vue.ref([]);
      let amplitudeZData = vue.ref([]);
      let amplitudeChartData = vue.ref([]);
      let amplitudeDataRMS = vue.ref([0, 0, 0]);
      let amplitudeDataPV = vue.ref([0, 0, 0]);
      let ampDataThreshold = vue.ref(0.02);
      let amplitudeChartOpts = vue.ref({
        dataLabel: false,
        update: true,
        duration: 0,
        dataPointShape: false,
        padding: [20, 30, 0, 5],
        xAxis: { boundaryGap: "justify", labelCount: 12 },
        yAxis: { gridType: "solid", data: [{ min: 0, max: 0.03, format: "yAxisFix3" }] },
        extra: { markLine: { data: [
          { value: ampDataThreshold, lineColor: "#DE4A42", showLabel: true, labelOffsetX: -10 }
          // 阈值标记线
        ] } }
      });
      const getAmplitudeData = async () => {
        let timeStamp = transformTimeStamp(0, "time_series");
        GetAmplitudeXData(timeStamp, selectedDeviceId.value).then((res) => {
          let xresponse = res.data;
          amplitudeXData.value = JSON.parse(JSON.stringify(processAmpData(xresponse)));
          amplitudeDataRMS.value[0] = parseFloat(calculateAmplitudeRMS(xresponse.data).toFixed(3));
          amplitudeDataPV.value[0] = parseFloat(calculateAmplitudePV(xresponse.data).toFixed(3));
          checkAmpData(xresponse);
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail10.vue:847", "Error getting X amplitude Data: ", error2);
        });
        GetAmplitudeYData(timeStamp, selectedDeviceId.value).then((res) => {
          let yresponse = res.data;
          amplitudeYData.value = JSON.parse(JSON.stringify(processAmpData(yresponse)));
          amplitudeDataRMS.value[1] = parseFloat(calculateAmplitudeRMS(yresponse.data).toFixed(3));
          amplitudeDataPV.value[1] = parseFloat(calculateAmplitudePV(yresponse.data).toFixed(3));
          checkAmpData(yresponse);
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail10.vue:877", "Error getting Y amplitude Data: ", error2);
        });
        GetAmplitudeZData(timeStamp, selectedDeviceId.value).then((res) => {
          let zresponse = res.data;
          amplitudeZData.value = JSON.parse(JSON.stringify(processAmpData(zresponse)));
          amplitudeDataRMS.value[2] = parseFloat(calculateAmplitudeRMS(zresponse.data).toFixed(3));
          amplitudeDataPV.value[2] = parseFloat(calculateAmplitudePV(zresponse.data).toFixed(3));
          checkAmpData(zresponse);
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail10.vue:907", "Error getting Z amplitude Data: ", error2);
        });
        if (curAxisIndex.value === 0) {
          amplitudeChartData.value = amplitudeXData.value;
        } else if (curAxisIndex.value === 1) {
          amplitudeChartData.value = amplitudeYData.value;
        } else if (curAxisIndex.value === 2) {
          amplitudeChartData.value = amplitudeZData.value;
        }
        getChartInfo();
      };
      const processAmpData = (originalData) => {
        let intervals = originalData.frequencyInterval;
        let roundedIntervals = intervals.map((num) => Math.floor(num));
        let resData = {
          categories: roundedIntervals,
          series: [{ name: originalData.direction + "轴", data: originalData.data }]
        };
        return resData;
      };
      const calculateAmplitudePV = (data) => {
        return data.length > 0 ? Math.max(...data) : void 0;
      };
      const calculateAmplitudeRMS = (data) => {
        let sqSum = 0;
        data.forEach((d2) => {
          sqSum += d2 * d2;
        });
        return data.length > 0 ? Math.sqrt(sqSum - data[0] * data[0] / 2 - data[data.length - 1] * data[data.length - 1] / 2) : void 0;
      };
      let curAxisIndex = vue.ref(0);
      const axisOrder = ["X轴", "Y轴", "Z轴"];
      let axisSelectList = vue.ref([
        { name: "X轴", disabled: false },
        { name: "Y轴", disabled: false },
        { name: "Z轴", disabled: false }
      ]);
      let axisSelectValue = vue.ref("X轴");
      let timeChartInfo = vue.ref(`时程曲线${axisOrder[curAxisIndex.value]}`);
      let ampChartInfo = vue.ref(`频谱曲线${axisOrder[curAxisIndex.value]}`);
      const axisRadioChange = (e2) => {
        changeAxis(e2);
      };
      const changeAxis = (axis) => {
        if (axis === "X轴") {
          curAxisIndex.value = 0;
          timeChartData.value = timeXData.value;
          amplitudeChartData.value = amplitudeXData.value;
        } else if (axis === "Y轴") {
          curAxisIndex.value = 1;
          timeChartData.value = timeYData.value;
          amplitudeChartData.value = amplitudeYData.value;
        } else if (axis === "Z轴") {
          curAxisIndex.value = 2;
          timeChartData.value = timeZData.value;
          amplitudeChartData.value = amplitudeZData.value;
        }
        isTimeLoading.value = true;
        isAmpLoading.value = true;
        setTimeout(() => {
          isTimeLoading.value = false;
          isAmpLoading.value = false;
        }, 1e3);
      };
      const getChartInfo = () => {
        timeChartInfo.value = `时程曲线${axisOrder[curAxisIndex.value]}`;
        ampChartInfo.value = `频谱曲线${axisOrder[curAxisIndex.value]}`;
        if (!isLastDegree.value) {
          if (isValid.value)
            timeChartInfo.value += `-有效值:${timeDataRMS.value[curAxisIndex.value]}`, ampChartInfo.value += `-有效值:${amplitudeDataRMS.value[curAxisIndex.value]}`;
          if (isPeak.value)
            timeChartInfo.value += `-峰值:${timeDataPV.value[curAxisIndex.value]}`, ampChartInfo.value += `-峰值:${amplitudeDataPV.value[curAxisIndex.value]}`;
        } else {
          if (isValid.value)
            timeChartInfo.value += `-有效值:${lastTimeDataRMS.value[curAxisIndex.value]}`, ampChartInfo.value += `-有效值:${amplitudeDataRMS.value[curAxisIndex.value]}`;
          if (isPeak.value)
            timeChartInfo.value += `-峰值:${lastTimeDataPV.value[curAxisIndex.value]}`, ampChartInfo.value += `-峰值:${amplitudeDataPV.value[curAxisIndex.value]}`;
        }
      };
      let lastTimeAnomalyStamp = vue.ref(0);
      let lastAmpAnomalyStamp = vue.ref(0);
      const calculateTimeRatio = (anomalyData) => {
        let r2 = anomalyData / timeDataThreshold.value - 1;
        if (r2 >= 0 && r2 <= 1)
          return 1;
        else if (r2 > 1 && r2 <= 2)
          return 2;
        else if (r2 > 2 && r2 <= 3)
          return 3;
        else
          return 4;
      };
      const checkTimeData = (originalData) => {
        for (let index = 0; index < originalData.data.length; index++) {
          const t_data = originalData.data[index];
          const stamp = Date.now();
          if (t_data > timeDataThreshold.value) {
            let urg = calculateTimeRatio(t_data);
            let exceptionTimeData = {
              time: originalData.sdata + index * 8,
              direction: originalData.direction,
              device: originalData.device,
              data: t_data,
              urgency: urg,
              threshold: timeDataThreshold.value
            };
            if (urg >= 2 && stamp - lastTimeAnomalyStamp.value > anomalyGap) {
              lastTimeAnomalyStamp.value = stamp;
              uni.showModal({
                title: "异常预警",
                content: "时程数据异常，预警信息已发送。",
                showCancel: false,
                confirmText: "好的",
                success: () => {
                }
              });
              saveExceptionTimeData(exceptionTimeData);
              return;
            }
          }
        }
      };
      const saveExceptionTimeData = async (exceptionData) => {
        PostTimeDataAnomaly(exceptionData).then((res) => {
          formatAppLog("log", "at pages/index/SensorDetail10.vue:1093", "PostTimeAnomaly response: ", res);
          formatAppLog("log", "at pages/index/SensorDetail10.vue:1094", "Successfully uploaded time exceptional data.");
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail10.vue:1097", "Error post time excetional data: ", error2);
        });
      };
      const calculateAmpRatio = (anomalyData) => {
        let r2 = anomalyData / ampDataThreshold.value - 1;
        if (r2 >= 0 && r2 <= 1)
          return 1;
        else if (r2 > 1 && r2 <= 2)
          return 2;
        else if (r2 > 2 && r2 <= 3)
          return 3;
        else
          return 4;
      };
      const checkAmpData = (originalData) => {
        for (let index = 0; index < originalData.data.length; index++) {
          const a_data = originalData.data[index];
          const stamp = Date.now();
          if (a_data > ampDataThreshold.value) {
            let urg = calculateAmpRatio(a_data);
            let exceptionAmpData = {
              time: originalData.fdata,
              // 频谱默认传回结束时间
              direction: originalData.direction,
              device: originalData.device,
              frequency_interval: originalData.frequencyInterval[index],
              data: a_data,
              urgency: urg,
              threshold: ampDataThreshold.value
            };
            if (urg >= 2 && stamp - lastAmpAnomalyStamp.value > anomalyGap) {
              lastAmpAnomalyStamp.value = stamp;
              uni.showModal({
                title: "异常预警",
                content: "频谱数据异常，预警信息已发送。",
                showCancel: false,
                confirmText: "好的",
                success: () => {
                }
              });
              saveExceptionAmpData(exceptionAmpData);
              return;
            }
          }
        }
      };
      const saveExceptionAmpData = async (exceptionData) => {
        PostAmplitudeDataAnomaly(exceptionData).then((res) => {
          formatAppLog("log", "at pages/index/SensorDetail10.vue:1164", "PostAmplitudeAnomaly response: ", res);
          formatAppLog("log", "at pages/index/SensorDetail10.vue:1165", "Successfully uploaded amplitude exceptional data.");
        }).catch((error2) => {
          formatAppLog("error", "at pages/index/SensorDetail10.vue:1168", "Error post amplitude excetional data: ", error2);
        });
      };
      let timeDataIntervalId;
      let ampDataIntervalId;
      let lastDegDataItvlId;
      let timeDataInterval = 1e3;
      let ampDataInterval = 1e3;
      let lastDegDataItv = 1e3;
      onLoad((options) => {
        selectedDeviceId.value = options.device;
      });
      onShow(() => {
        getAllDevices();
        lastDegDataItvlId = setInterval(getLastTimeData, lastDegDataItv);
        timeDataIntervalId = setInterval(getTimeData, timeDataInterval);
        ampDataIntervalId = setInterval(getAmplitudeData, ampDataInterval);
      });
      onUnload(() => {
        clearInterval(timeDataIntervalId);
        clearInterval(ampDataIntervalId);
      });
      const __returned__ = { settingsVisible, isValid, isPeak, timeLimitValue, ampLimitValue, toggleSettings, handleSwitchChange, confirmTimeLimitInput, confirmAmpLimitInput, toast: toast2, showModal, get allDevices() {
        return allDevices;
      }, set allDevices(v2) {
        allDevices = v2;
      }, get selectedDeviceId() {
        return selectedDeviceId;
      }, set selectedDeviceId(v2) {
        selectedDeviceId = v2;
      }, getAllDevices, get selectedDegree() {
        return selectedDegree;
      }, set selectedDegree(v2) {
        selectedDegree = v2;
      }, get selectedTableName() {
        return selectedTableName;
      }, set selectedTableName(v2) {
        selectedTableName = v2;
      }, get selectedInterval() {
        return selectedInterval;
      }, set selectedInterval(v2) {
        selectedInterval = v2;
      }, get degreeSelectList() {
        return degreeSelectList;
      }, set degreeSelectList(v2) {
        degreeSelectList = v2;
      }, get degreeSelectValue() {
        return degreeSelectValue;
      }, set degreeSelectValue(v2) {
        degreeSelectValue = v2;
      }, get isTimeLoading() {
        return isTimeLoading;
      }, set isTimeLoading(v2) {
        isTimeLoading = v2;
      }, get isAmpLoading() {
        return isAmpLoading;
      }, set isAmpLoading(v2) {
        isAmpLoading = v2;
      }, get lastCount() {
        return lastCount;
      }, set lastCount(v2) {
        lastCount = v2;
      }, secondItv, minuteItv, hourItv, dayItv, monthItv, yearItv, degreeRadioChange, get isLastDegree() {
        return isLastDegree;
      }, set isLastDegree(v2) {
        isLastDegree = v2;
      }, get lastXData() {
        return lastXData;
      }, set lastXData(v2) {
        lastXData = v2;
      }, get lastYData() {
        return lastYData;
      }, set lastYData(v2) {
        lastYData = v2;
      }, get lastZData() {
        return lastZData;
      }, set lastZData(v2) {
        lastZData = v2;
      }, get lastTimeDataRMS() {
        return lastTimeDataRMS;
      }, set lastTimeDataRMS(v2) {
        lastTimeDataRMS = v2;
      }, get lastTimeDataPV() {
        return lastTimeDataPV;
      }, set lastTimeDataPV(v2) {
        lastTimeDataPV = v2;
      }, toLastDegree, toDataNow, getLastTimeData, adjustTimeYAxis, transformTimeStamp, transLastStamp, padZero, caculateTimeList, get timeXData() {
        return timeXData;
      }, set timeXData(v2) {
        timeXData = v2;
      }, get timeYData() {
        return timeYData;
      }, set timeYData(v2) {
        timeYData = v2;
      }, get timeZData() {
        return timeZData;
      }, set timeZData(v2) {
        timeZData = v2;
      }, get timeChartData() {
        return timeChartData;
      }, set timeChartData(v2) {
        timeChartData = v2;
      }, get timeDataRMS() {
        return timeDataRMS;
      }, set timeDataRMS(v2) {
        timeDataRMS = v2;
      }, get timeDataPV() {
        return timeDataPV;
      }, set timeDataPV(v2) {
        timeDataPV = v2;
      }, get timeDataThreshold() {
        return timeDataThreshold;
      }, set timeDataThreshold(v2) {
        timeDataThreshold = v2;
      }, get timeChartMin() {
        return timeChartMin;
      }, set timeChartMin(v2) {
        timeChartMin = v2;
      }, get timeChartMax() {
        return timeChartMax;
      }, set timeChartMax(v2) {
        timeChartMax = v2;
      }, get timeChartFormat() {
        return timeChartFormat;
      }, set timeChartFormat(v2) {
        timeChartFormat = v2;
      }, get timeChartOpts() {
        return timeChartOpts;
      }, set timeChartOpts(v2) {
        timeChartOpts = v2;
      }, getTimeData, processTimeData, calculateTimePV, calculateTimeRMS, get amplitudeXData() {
        return amplitudeXData;
      }, set amplitudeXData(v2) {
        amplitudeXData = v2;
      }, get amplitudeYData() {
        return amplitudeYData;
      }, set amplitudeYData(v2) {
        amplitudeYData = v2;
      }, get amplitudeZData() {
        return amplitudeZData;
      }, set amplitudeZData(v2) {
        amplitudeZData = v2;
      }, get amplitudeChartData() {
        return amplitudeChartData;
      }, set amplitudeChartData(v2) {
        amplitudeChartData = v2;
      }, get amplitudeDataRMS() {
        return amplitudeDataRMS;
      }, set amplitudeDataRMS(v2) {
        amplitudeDataRMS = v2;
      }, get amplitudeDataPV() {
        return amplitudeDataPV;
      }, set amplitudeDataPV(v2) {
        amplitudeDataPV = v2;
      }, get ampDataThreshold() {
        return ampDataThreshold;
      }, set ampDataThreshold(v2) {
        ampDataThreshold = v2;
      }, get amplitudeChartOpts() {
        return amplitudeChartOpts;
      }, set amplitudeChartOpts(v2) {
        amplitudeChartOpts = v2;
      }, getAmplitudeData, processAmpData, calculateAmplitudePV, calculateAmplitudeRMS, get curAxisIndex() {
        return curAxisIndex;
      }, set curAxisIndex(v2) {
        curAxisIndex = v2;
      }, axisOrder, get axisSelectList() {
        return axisSelectList;
      }, set axisSelectList(v2) {
        axisSelectList = v2;
      }, get axisSelectValue() {
        return axisSelectValue;
      }, set axisSelectValue(v2) {
        axisSelectValue = v2;
      }, get timeChartInfo() {
        return timeChartInfo;
      }, set timeChartInfo(v2) {
        timeChartInfo = v2;
      }, get ampChartInfo() {
        return ampChartInfo;
      }, set ampChartInfo(v2) {
        ampChartInfo = v2;
      }, axisRadioChange, changeAxis, getChartInfo, get lastTimeAnomalyStamp() {
        return lastTimeAnomalyStamp;
      }, set lastTimeAnomalyStamp(v2) {
        lastTimeAnomalyStamp = v2;
      }, get lastAmpAnomalyStamp() {
        return lastAmpAnomalyStamp;
      }, set lastAmpAnomalyStamp(v2) {
        lastAmpAnomalyStamp = v2;
      }, anomalyGap, calculateTimeRatio, checkTimeData, saveExceptionTimeData, calculateAmpRatio, checkAmpData, saveExceptionAmpData, get timeDataIntervalId() {
        return timeDataIntervalId;
      }, set timeDataIntervalId(v2) {
        timeDataIntervalId = v2;
      }, get ampDataIntervalId() {
        return ampDataIntervalId;
      }, set ampDataIntervalId(v2) {
        ampDataIntervalId = v2;
      }, get lastDegDataItvlId() {
        return lastDegDataItvlId;
      }, set lastDegDataItvlId(v2) {
        lastDegDataItvlId = v2;
      }, get timeDataInterval() {
        return timeDataInterval;
      }, set timeDataInterval(v2) {
        timeDataInterval = v2;
      }, get ampDataInterval() {
        return ampDataInterval;
      }, set ampDataInterval(v2) {
        ampDataInterval = v2;
      }, get lastDegDataItv() {
        return lastDegDataItv;
      }, set lastDegDataItv(v2) {
        lastDegDataItv = v2;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_toast = resolveEasycom(vue.resolveDynamicComponent("u-toast"), __easycom_0$5);
    const _component_u_modal = resolveEasycom(vue.resolveDynamicComponent("u-modal"), __easycom_1$1);
    const _component_u_switch = resolveEasycom(vue.resolveDynamicComponent("u-switch"), __easycom_2);
    const _component_u_input = resolveEasycom(vue.resolveDynamicComponent("u-input"), __easycom_3);
    const _component_u_radio = resolveEasycom(vue.resolveDynamicComponent("u-radio"), __easycom_4);
    const _component_u_radio_group = resolveEasycom(vue.resolveDynamicComponent("u-radio-group"), __easycom_5);
    const _component_u_button = resolveEasycom(vue.resolveDynamicComponent("u-button"), __easycom_6);
    const _component_qiun_data_charts = resolveEasycom(vue.resolveDynamicComponent("qiun-data-charts"), __easycom_7);
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 弹窗提示 "),
      vue.createVNode(
        _component_u_toast,
        { ref: "toast" },
        null,
        512
        /* NEED_PATCH */
      ),
      vue.createVNode(_component_u_modal, {
        modelValue: $setup.showModal,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.showModal = $event),
        duration: 1e3,
        class: "custom-modal"
      }, {
        default: vue.withCtx(() => [
          vue.createTextVNode("建议您横屏观看效果更佳")
        ]),
        _: 1
        /* STABLE */
      }, 8, ["modelValue"]),
      vue.createCommentVNode(" 设置侧边栏 "),
      $setup.settingsVisible ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "settings-sidebar"
      }, [
        vue.createCommentVNode('\r\n			<view class="settings-header">\n		    <u-icon name="arrow-right" size="30" @click="toggleSettings"></u-icon>\n			</view> \r\n		'),
        vue.createElementVNode("view", { class: "settings-content" }, [
          vue.createElementVNode("view", { class: "settings-item" }, [
            vue.createVNode(_component_u_switch, {
              modelValue: $setup.isValid,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.isValid = $event),
              onChange: _cache[2] || (_cache[2] = ($event) => $setup.handleSwitchChange("isValid", $event))
            }, null, 8, ["modelValue"]),
            vue.createElementVNode("text", null, "有效值")
          ]),
          vue.createElementVNode("view", { class: "settings-item" }, [
            vue.createVNode(_component_u_switch, {
              modelValue: $setup.isPeak,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.isPeak = $event),
              onChange: _cache[4] || (_cache[4] = ($event) => $setup.handleSwitchChange("isPeak", $event))
            }, null, 8, ["modelValue"]),
            vue.createElementVNode("text", null, "峰值")
          ]),
          vue.createElementVNode("view", { class: "settings-item" }, [
            vue.createVNode(_component_u_input, {
              modelValue: $setup.timeLimitValue,
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.timeLimitValue = $event),
              type: "number",
              placeholder: "请输入时程阈值",
              onBlur: $setup.confirmTimeLimitInput
            }, null, 8, ["modelValue"])
          ]),
          vue.createElementVNode("view", { class: "settings-item" }, [
            vue.createVNode(_component_u_input, {
              modelValue: $setup.ampLimitValue,
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.ampLimitValue = $event),
              type: "number",
              placeholder: "请输入频谱阈值",
              onBlur: $setup.confirmAmpLimitInput
            }, null, 8, ["modelValue"])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 分度值选择和历史数据查看 "),
      vue.createElementVNode("view", { class: "controlbar" }, [
        vue.createVNode(_component_u_radio_group, {
          modelValue: $setup.degreeSelectValue,
          "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.degreeSelectValue = $event)
        }, {
          default: vue.withCtx(() => [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.degreeSelectList, (item, index) => {
                return vue.openBlock(), vue.createBlock(_component_u_radio, {
                  onChange: $setup.degreeRadioChange,
                  key: index,
                  name: item.name,
                  disabled: item.disabled
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(
                      vue.toDisplayString(item.name),
                      1
                      /* TEXT */
                    )
                  ]),
                  _: 2
                  /* DYNAMIC */
                }, 1032, ["name", "disabled"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"]),
        vue.createElementVNode("view", { class: "last-degree-buttons" }, [
          !$setup.isLastDegree && ($setup.selectedDegree === "日" || $setup.selectedDegree === "月" || $setup.selectedDegree === "年") ? (vue.openBlock(), vue.createBlock(_component_u_button, {
            key: 0,
            class: "last-degree-button",
            onClick: $setup.toLastDegree
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(
                "◀ 查看上一" + vue.toDisplayString($setup.selectedDegree),
                1
                /* TEXT */
              )
            ]),
            _: 1
            /* STABLE */
          })) : vue.createCommentVNode("v-if", true),
          $setup.isLastDegree ? (vue.openBlock(), vue.createBlock(_component_u_button, {
            key: 1,
            class: "last-degree-button",
            onClick: $setup.toLastDegree
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(
                "◀ 查看上一" + vue.toDisplayString($setup.selectedDegree),
                1
                /* TEXT */
              )
            ]),
            _: 1
            /* STABLE */
          })) : vue.createCommentVNode("v-if", true),
          $setup.isLastDegree ? (vue.openBlock(), vue.createBlock(_component_u_button, {
            key: 2,
            class: "last-degree-button",
            onClick: _cache[8] || (_cache[8] = ($event) => $setup.toDataNow($setup.selectedDegree))
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(
                "回到当前" + vue.toDisplayString($setup.selectedDegree) + " ▶",
                1
                /* TEXT */
              )
            ]),
            _: 1
            /* STABLE */
          })) : vue.createCommentVNode("v-if", true)
        ])
      ]),
      vue.createCommentVNode(" 数据图表 "),
      vue.createElementVNode("view", { class: "dashboard-cards" }, [
        vue.createElementVNode("view", { class: "chart-info" }, [
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($setup.timeChartInfo),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "card" }, [
          $setup.isTimeLoading ? (vue.openBlock(), vue.createBlock(_component_qiun_data_charts, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_qiun_data_charts, {
            key: 1,
            type: "line",
            opts: $setup.timeChartOpts,
            chartData: $setup.timeChartData,
            loadingType: 0
          }, null, 8, ["opts", "chartData"]))
        ]),
        vue.createElementVNode("view", { class: "chart-info" }, [
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($setup.ampChartInfo),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "card" }, [
          $setup.isAmpLoading ? (vue.openBlock(), vue.createBlock(_component_qiun_data_charts, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_qiun_data_charts, {
            key: 1,
            type: "line",
            opts: $setup.amplitudeChartOpts,
            chartData: $setup.amplitudeChartData,
            loadingType: 0
          }, null, 8, ["opts", "chartData"]))
        ])
      ]),
      vue.createCommentVNode(" X、Y、Z 轴切换按钮 "),
      vue.createElementVNode("view", { class: "controlbar" }, [
        vue.createVNode(_component_u_radio_group, {
          modelValue: $setup.axisSelectValue,
          "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $setup.axisSelectValue = $event)
        }, {
          default: vue.withCtx(() => [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.axisSelectList, (item, index) => {
                return vue.openBlock(), vue.createBlock(_component_u_radio, {
                  onChange: $setup.axisRadioChange,
                  key: index,
                  name: item.name,
                  disabled: item.disabled
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(
                      vue.toDisplayString(item.name),
                      1
                      /* TEXT */
                    )
                  ]),
                  _: 2
                  /* DYNAMIC */
                }, 1032, ["name", "disabled"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          _: 1
          /* STABLE */
        }, 8, ["modelValue"])
      ])
    ]);
  }
  const PagesIndexSensorDetail10 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-7b4f4645"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/pages/index/SensorDetail10.vue"]]);
  const _sfc_main$5 = {
    methods: {
      navigateToDataPage1() {
        uni.navigateTo({
          url: "/pages/index/SelectBuilding"
        });
      },
      navigateToDataPage2() {
        uni.navigateTo({
          url: "/pages/abnormal/AbnormalGuide"
        });
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "welcome-container" }, [
      vue.createElementVNode("text", { class: "welcome-message" }, "欢迎用户 yaoyao！"),
      vue.createElementVNode("text", { class: "prompt" }, "请您选择所要查看的数据"),
      vue.createElementVNode("button", {
        class: "button",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.navigateToDataPage1 && $options.navigateToDataPage1(...args))
      }, "查看实时数据图表"),
      vue.createElementVNode("button", {
        class: "button",
        onClick: _cache[1] || (_cache[1] = (...args) => $options.navigateToDataPage2 && $options.navigateToDataPage2(...args))
      }, "查看历史异常数据")
    ]);
  }
  const PagesIndexGuide = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-43a51a04"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/pages/index/Guide.vue"]]);
  const _sfc_main$4 = {
    data() {
      return {
        buildings: []
        // 用于存储从API获取的建筑数据
      };
    },
    methods: {
      async fetchBuildings() {
        const url2 = "http://110.42.214.164:8003/building";
        try {
          const response = await uni.request({
            url: url2,
            method: "GET",
            data: {}
          });
          if (response.data.code === 200 && response.data.data) {
            this.buildings = response.data.data;
          } else {
            uni.showToast({
              title: "网络错误，请稍后再试",
              icon: "none",
              duration: 2e3
            });
            formatAppLog("error", "at pages/abnormal/AbnormalGuide.vue:40", "网络错误：", error);
          }
        } catch (error2) {
          uni.showToast({
            title: "网络错误，请稍后再试",
            icon: "none",
            duration: 2e3
          });
          formatAppLog("error", "at pages/abnormal/AbnormalGuide.vue:49", "请求错误：", error2);
        }
      },
      goToBuilding(buildingId) {
        const url2 = `/pages/abnormal/Building${buildingId}`;
        uni.navigateTo({
          url: url2
        });
      }
    },
    mounted() {
      this.fetchBuildings();
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "exception-container" }, [
      vue.createElementVNode("text", { class: "exception-prompt" }, "您希望查看哪个建筑的异常数据"),
      vue.createElementVNode("view", { class: "building-box" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.buildings, (building) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: building.buildingId,
              class: "building-item",
              onClick: ($event) => $options.goToBuilding(building.buildingId)
            }, [
              vue.createElementVNode("image", {
                src: building.imageUrl,
                mode: "aspectFill",
                class: "building-image"
              }, null, 8, ["src"]),
              vue.createElementVNode(
                "view",
                { class: "building-name" },
                "同济大学 " + vue.toDisplayString(building.name),
                1
                /* TEXT */
              )
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ]);
  }
  const PagesAbnormalAbnormalGuide = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-751ea441"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/pages/abnormal/AbnormalGuide.vue"]]);
  const _sfc_main$3 = {
    emits: ["update:modelValue", "input", "confirm"],
    props: {
      // 通过双向绑定控制组件的弹出与收起
      value: {
        type: Boolean,
        default: false
      },
      modelValue: {
        type: Boolean,
        default: false
      },
      // 列数据
      list: {
        type: Array,
        default() {
          return [];
        }
      },
      // 是否显示边框
      border: {
        type: Boolean,
        default: true
      },
      // "取消"按钮的颜色
      cancelColor: {
        type: String,
        default: "#606266"
      },
      // "确定"按钮的颜色
      confirmColor: {
        type: String,
        default: "#2979ff"
      },
      // 弹出的z-index值
      zIndex: {
        type: [String, Number],
        default: 0
      },
      safeAreaInsetBottom: {
        type: Boolean,
        default: false
      },
      // 是否允许通过点击遮罩关闭Picker
      maskCloseAble: {
        type: Boolean,
        default: true
      },
      // 提供的默认选中的下标
      defaultValue: {
        type: Array,
        default() {
          return [0];
        }
      },
      // 模式选择，single-column-单列，mutil-column-多列，mutil-column-auto-多列联动
      mode: {
        type: String,
        default: "single-column"
      },
      // 自定义value属性名
      valueName: {
        type: String,
        default: "value"
      },
      // 自定义label属性名
      labelName: {
        type: String,
        default: "label"
      },
      // 自定义多列联动模式的children属性名
      childName: {
        type: String,
        default: "children"
      },
      // 顶部标题
      title: {
        type: String,
        default: ""
      },
      // 取消按钮的文字
      cancelText: {
        type: String,
        default: "取消"
      },
      // 确认按钮的文字
      confirmText: {
        type: String,
        default: "确认"
      },
      // 遮罩的模糊度
      blur: {
        type: [Number, String],
        default: 0
      }
    },
    data() {
      return {
        popupValue: false,
        // 用于列改变时，保存当前的索引，下一次变化时比较得出是哪一列发生了变化
        defaultSelector: [0],
        // picker-view的数据
        columnData: [],
        // 每次队列发生变化时，保存选择的结果
        selectValue: [],
        // 上一次列变化时的index
        lastSelectIndex: [],
        // 列数
        columnNum: 0,
        // 列是否还在滑动中，微信小程序如果在滑动中就点确定，结果可能不准确
        moving: false,
        reset: false
      };
    },
    watch: {
      // 在select弹起的时候，重新初始化所有数据
      valueCom: {
        immediate: true,
        handler(val) {
          if (val) {
            this.reset = true;
            setTimeout(() => this.init(), 10);
          }
          this.popupValue = val;
        }
      }
    },
    computed: {
      uZIndex() {
        return this.zIndex ? this.zIndex : this.$u.zIndex.popup;
      },
      valueCom() {
        return this.modelValue;
      },
      // 用来兼容小程序、App、h5
      showColumnCom() {
        return true;
      }
    },
    methods: {
      // 标识滑动开始，只有微信小程序才有这样的事件
      pickstart() {
      },
      // 标识滑动结束
      pickend() {
      },
      init() {
        this.reset = false;
        this.setColumnNum();
        this.setDefaultSelector();
        this.setColumnData();
        this.setSelectValue();
      },
      // 获取默认选中列下标
      setDefaultSelector() {
        this.defaultSelector = this.defaultValue.length == this.columnNum ? this.defaultValue : Array(this.columnNum).fill(0);
        this.lastSelectIndex = this.$u.deepClone(this.defaultSelector);
      },
      // 计算列数
      setColumnNum() {
        if (this.mode == "single-column")
          this.columnNum = 1;
        else if (this.mode == "mutil-column")
          this.columnNum = this.list.length;
        else if (this.mode == "mutil-column-auto") {
          let num = 1;
          let column = this.list;
          while (column[0][this.childName]) {
            column = column[0] ? column[0][this.childName] : {};
            num++;
          }
          this.columnNum = num;
        }
      },
      // 获取需要展示在picker中的列数据
      setColumnData() {
        let data = [];
        this.selectValue = [];
        if (this.mode == "mutil-column-auto") {
          let column = this.list[this.defaultSelector.length ? this.defaultSelector[0] : 0];
          for (let i2 = 0; i2 < this.columnNum; i2++) {
            if (i2 == 0) {
              data[i2] = this.list;
              column = column[this.childName];
            } else {
              data[i2] = column;
              column = column[this.defaultSelector[i2]][this.childName];
            }
          }
        } else if (this.mode == "single-column") {
          data[0] = this.list;
        } else {
          data = this.list;
        }
        this.columnData = data;
      },
      // 获取默认选中的值，如果没有设置defaultValue，就默认选中每列的第一个
      setSelectValue() {
        let tmp = null;
        for (let i2 = 0; i2 < this.columnNum; i2++) {
          tmp = this.columnData[i2][this.defaultSelector[i2]];
          let data = {
            index: this.defaultSelector[i2],
            value: tmp ? tmp[this.valueName] : null,
            label: tmp ? tmp[this.labelName] : null
          };
          if (tmp && tmp.extra !== void 0)
            data.extra = tmp.extra;
          this.selectValue.push(data);
        }
      },
      // 列选项
      columnChange(e2) {
        let index = null;
        let columnIndex = e2.detail.value;
        this.selectValue = [];
        if (this.mode == "mutil-column-auto") {
          this.lastSelectIndex.map((val, idx) => {
            if (val != columnIndex[idx])
              index = idx;
          });
          this.defaultSelector = columnIndex;
          for (let i2 = index + 1; i2 < this.columnNum; i2++) {
            this.columnData[i2] = this.columnData[i2 - 1][i2 - 1 == index ? columnIndex[index] : 0][this.childName];
            this.defaultSelector[i2] = 0;
          }
          columnIndex.map((item, index2) => {
            let data = this.columnData[index2][columnIndex[index2]];
            let tmp = {
              index: columnIndex[index2],
              value: data ? data[this.valueName] : null,
              label: data ? data[this.labelName] : null
            };
            if (data && data.extra !== void 0)
              tmp.extra = data.extra;
            this.selectValue.push(tmp);
          });
          this.lastSelectIndex = columnIndex;
        } else if (this.mode == "single-column") {
          let data = this.columnData[0][columnIndex[0]];
          let tmp = {
            index: columnIndex[0],
            value: data ? data[this.valueName] : null,
            label: data ? data[this.labelName] : null
          };
          if (data && data.extra !== void 0)
            tmp.extra = data.extra;
          this.selectValue.push(tmp);
          this.lastSelectIndex = columnIndex;
        } else if (this.mode == "mutil-column") {
          columnIndex.map((item, index2) => {
            let data = this.columnData[index2][columnIndex[index2]];
            let tmp = {
              index: columnIndex[index2],
              value: data ? data[this.valueName] : null,
              label: data ? data[this.labelName] : null
            };
            if (data && data.extra !== void 0)
              tmp.extra = data.extra;
            this.selectValue.push(tmp);
          });
          this.lastSelectIndex = columnIndex;
        }
      },
      close() {
        this.$emit("input", false);
        this.$emit("update:modelValue", false);
      },
      // 点击确定或者取消
      getResult(event = null) {
        if (event)
          this.$emit(event, this.selectValue);
        this.close();
      },
      selectHandler() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_popup = resolveEasycom(vue.resolveDynamicComponent("u-popup"), __easycom_0$2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "u-select" }, [
      vue.createCommentVNode(` <view class="u-select__action" :class="{
			'u-select--border': border
		}" @tap.stop="selectHandler">
			<view class="u-select__action__icon" :class="{
				'u-select__action__icon--reverse': value == true
			}">
				<u-icon name="arrow-down-fill" size="26" color="#c0c4cc"></u-icon>
			</view>
		</view> `),
      vue.createVNode(_component_u_popup, {
        blur: $props.blur,
        maskCloseAble: $props.maskCloseAble,
        mode: "bottom",
        popup: false,
        modelValue: $data.popupValue,
        "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.popupValue = $event),
        length: "auto",
        safeAreaInsetBottom: $props.safeAreaInsetBottom,
        onClose: $options.close,
        "z-index": $options.uZIndex
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "u-select" }, [
            vue.createElementVNode(
              "view",
              {
                class: "u-select__header",
                onTouchmove: _cache[3] || (_cache[3] = vue.withModifiers(() => {
                }, ["stop", "prevent"]))
              },
              [
                vue.createElementVNode(
                  "view",
                  {
                    class: "u-select__header__cancel u-select__header__btn",
                    style: vue.normalizeStyle({ color: $props.cancelColor }),
                    "hover-class": "u-hover-class",
                    "hover-stay-time": 150,
                    onClick: _cache[0] || (_cache[0] = ($event) => $options.getResult("cancel"))
                  },
                  vue.toDisplayString($props.cancelText),
                  5
                  /* TEXT, STYLE */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "u-select__header__title" },
                  vue.toDisplayString($props.title),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  {
                    class: "u-select__header__confirm u-select__header__btn",
                    style: vue.normalizeStyle({ color: $data.moving ? $props.cancelColor : $props.confirmColor }),
                    "hover-class": "u-hover-class",
                    "hover-stay-time": 150,
                    onTouchmove: _cache[1] || (_cache[1] = vue.withModifiers(() => {
                    }, ["stop"])),
                    onClick: _cache[2] || (_cache[2] = vue.withModifiers(($event) => $options.getResult("confirm"), ["stop"]))
                  },
                  vue.toDisplayString($props.confirmText),
                  37
                  /* TEXT, STYLE, NEED_HYDRATION */
                )
              ],
              32
              /* NEED_HYDRATION */
            ),
            vue.createElementVNode("view", { class: "u-select__body" }, [
              vue.createElementVNode("picker-view", {
                onChange: _cache[4] || (_cache[4] = (...args) => $options.columnChange && $options.columnChange(...args)),
                class: "u-select__body__picker-view",
                value: $data.defaultSelector,
                onPickstart: _cache[5] || (_cache[5] = (...args) => $options.pickstart && $options.pickstart(...args)),
                onPickend: _cache[6] || (_cache[6] = (...args) => $options.pickend && $options.pickend(...args))
              }, [
                $options.showColumnCom ? (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  { key: 0 },
                  vue.renderList($data.columnData, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("picker-view-column", { key: index }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList(item, (item1, index1) => {
                          return vue.openBlock(), vue.createElementBlock("view", {
                            class: "u-select__body__picker-view__item",
                            key: index1
                          }, [
                            vue.createElementVNode(
                              "view",
                              { class: "u-line-1" },
                              vue.toDisplayString(item1[$props.labelName]),
                              1
                              /* TEXT */
                            )
                          ]);
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                )) : vue.createCommentVNode("v-if", true)
              ], 40, ["value"])
            ])
          ])
        ]),
        _: 1
        /* STABLE */
      }, 8, ["blur", "maskCloseAble", "modelValue", "safeAreaInsetBottom", "onClose", "z-index"])
    ]);
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-2ab5fcb0"], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/uni_modules/vk-uview-ui/components/u-select/u-select.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {
        activeType: "timeCurve",
        timeCurveData: [],
        frequencySpectrumData: [],
        filters: {
          startYear: null,
          startMonth: null,
          startDay: null,
          endYear: null,
          endMonth: null,
          endDay: null,
          direction: null,
          device: null,
          urgency: null
        },
        years: Array.from({ length: 50 }, (_2, i2) => (/* @__PURE__ */ new Date()).getFullYear() - i2),
        months: Array.from({ length: 12 }, (_2, i2) => i2 + 1),
        days: Array.from({ length: 31 }, (_2, i2) => i2 + 1),
        directionList: [{ label: "全部", value: null }, { label: "X", value: "X" }, { label: "Y", value: "Y" }, { label: "Z", value: "Z" }],
        deviceSelectList: [
          { label: "全部", value: null },
          { label: "4787BE3A", value: "4787BE3A" },
          { label: "8850A7D7", value: "8850A7D7" },
          { label: "8361D7CD", value: "8361D7CD" },
          { label: "612B04ED", value: "612B04ED" },
          { label: "E884C99D", value: "E884C99D" }
        ],
        urgencyList: [
          { label: "全部", value: null },
          { label: "低", value: 1 },
          { label: "中", value: 2 },
          { label: "高", value: 3 },
          { label: "极高", value: 4 }
        ],
        showDirectionFilter: false,
        showDeviceFilter: false,
        showUrgencyFilter: false
      };
    },
    computed: {
      filteredTimeCurveData() {
        return this.applyFilter(this.timeCurveData);
      },
      filteredFrequencySpectrumData() {
        return this.applyFilter(this.frequencySpectrumData);
      }
    },
    methods: {
      async fetchData() {
        try {
          const timeUrl = "http://110.42.214.164:8003/TimeAnomaly";
          const spectrumUrl = "http://110.42.214.164:8003/SpectrumAnomaly";
          const timeResponse = await uni.request({
            url: timeUrl,
            method: "GET",
            data: {}
          });
          const spectrumResponse = await uni.request({
            url: spectrumUrl,
            method: "GET",
            data: {}
          });
          const timeResult = timeResponse.data;
          const spectrumResult = spectrumResponse.data;
          if (timeResult.code === 200) {
            this.timeCurveData = timeResult.data;
          }
          if (spectrumResult.code === 200) {
            this.frequencySpectrumData = spectrumResult.data;
          }
        } catch (error2) {
          formatAppLog("error", "at pages/abnormal/Building1.vue:235", "获取数据失败：", error2);
        }
      },
      applyFilter(data) {
        return data.filter((item) => {
          const matchesDirection = !this.filters.direction || item.direction === this.filters.direction;
          const matchesDevice = !this.filters.device || item.device === this.filters.device;
          const matchesUrgency = !this.filters.urgency || item.urgency === this.filters.urgency;
          return matchesDirection && matchesDevice && matchesUrgency;
        });
      },
      applyTimeFilter() {
        this.filteredTimeCurveData = this.applyFilter(this.timeCurveData);
        this.filteredFrequencySpectrumData = this.applyFilter(this.frequencySpectrumData);
      },
      resetFilters() {
        this.filters = {
          startYear: null,
          startMonth: null,
          startDay: null,
          endYear: null,
          endMonth: null,
          endDay: null,
          direction: null,
          device: null,
          urgency: null
        };
        this.applyTimeFilter();
      },
      applyFilter(data) {
        return data.filter((item) => {
          const matchesDirection = !this.filters.direction || item.direction === this.filters.direction;
          const matchesDevice = !this.filters.device || item.device === this.filters.device;
          const matchesUrgency = !this.filters.urgency || item.urgency === this.filters.urgency;
          const itemDate = new Date(item.time);
          const startDate = this.filters.startYear && this.filters.startMonth && this.filters.startDay ? new Date(this.filters.startYear, this.filters.startMonth - 1, this.filters.startDay) : null;
          const endDate = this.filters.endYear && this.filters.endMonth && this.filters.endDay ? new Date(this.filters.endYear, this.filters.endMonth - 1, this.filters.endDay) : null;
          const matchesTime = (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);
          return matchesDirection && matchesDevice && matchesUrgency && matchesTime;
        });
      },
      formatTime(timestamp) {
        const date2 = new Date(timestamp);
        return `${date2.getFullYear()}-${(date2.getMonth() + 1).toString().padStart(2, "0")}-${date2.getDate().toString().padStart(2, "0")} ${date2.getHours().toString().padStart(2, "0")}:${date2.getMinutes().toString().padStart(2, "0")}`;
      },
      formatUrgency(level) {
        const levels = { 1: "低", 2: "中", 3: "高", 4: "极高" };
        return levels[level];
      },
      setActiveType(type) {
        this.activeType = type;
      },
      toggleFilter(column) {
        this.showDirectionFilter = false;
        this.showDeviceFilter = false;
        this.showUrgencyFilter = false;
        if (column === "direction") {
          this.showDirectionFilter = true;
        } else if (column === "device") {
          this.showDeviceFilter = true;
        } else if (column === "urgency") {
          this.showUrgencyFilter = true;
        }
      },
      confirmFilterDirection(selected) {
        this.filters.direction = selected[0].value;
      },
      confirmFilterDevice(selected) {
        this.filters.device = selected[0].value;
      },
      confirmFilterUrgency(selected) {
        this.filters.urgency = selected[0].value;
      }
    },
    mounted() {
      this.fetchData();
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_select = resolveEasycom(vue.resolveDynamicComponent("u-select"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("div", {
      id: "app",
      class: "container"
    }, [
      vue.createCommentVNode(" 曲线类型选择 "),
      vue.createElementVNode("div", { class: "type-selector" }, [
        vue.createElementVNode(
          "button",
          {
            class: vue.normalizeClass({ "active": $data.activeType === "timeCurve" }),
            onClick: _cache[0] || (_cache[0] = ($event) => $options.setActiveType("timeCurve"))
          },
          " 时程曲线 ",
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "button",
          {
            class: vue.normalizeClass({ "active": $data.activeType === "frequencySpectrum" }),
            onClick: _cache[1] || (_cache[1] = ($event) => $options.setActiveType("frequencySpectrum"))
          },
          " 频谱曲线 ",
          2
          /* CLASS */
        )
      ]),
      vue.createCommentVNode(" 时间筛选器 "),
      vue.createCommentVNode('\r\n		<div class="time-filter">\r\n		  <label>\r\n		    开始时间：\r\n		    <select v-model="filters.startYear">\r\n		      <option value="" disabled>年</option>\r\n		      <option v-for="year in years" :key="year" :value="year">{{ year }}</option>\r\n		    </select>\r\n		    <select v-model="filters.startMonth">\r\n		      <option value="" disabled>月</option>\r\n		      <option v-for="month in months" :key="month" :value="month">{{ month }}</option>\r\n		    </select>\r\n		    <select v-model="filters.startDay">\r\n		      <option value="" disabled>日</option>\r\n		      <option v-for="day in days" :key="day" :value="day">{{ day }}</option>\r\n		    </select>\r\n		  </label>\r\n		  <label>\r\n		    结束时间：\r\n		    <select v-model="filters.endYear">\r\n		      <option value="" disabled>年</option>\r\n		      <option v-for="year in years" :key="year" :value="year">{{ year }}</option>\r\n		    </select>\r\n		    <select v-model="filters.endMonth">\r\n		      <option value="" disabled>月</option>\r\n		      <option v-for="month in months" :key="month" :value="month">{{ month }}</option>\r\n		    </select>\r\n		    <select v-model="filters.endDay">\r\n		      <option value="" disabled>日</option>\r\n		      <option v-for="day in days" :key="day" :value="day">{{ day }}</option>\r\n		    </select>\r\n		  </label>\r\n		</div>\r\n		'),
      vue.createCommentVNode(" 异常数据表 "),
      $data.activeType === "timeCurve" ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: "table-wrapper"
      }, [
        vue.createElementVNode("div", { class: "table-container" }, [
          vue.createElementVNode("table", null, [
            vue.createElementVNode("thead", null, [
              vue.createElementVNode("tr", null, [
                vue.createElementVNode("th", null, "时间"),
                vue.createElementVNode(
                  "th",
                  {
                    onClick: _cache[2] || (_cache[2] = ($event) => $options.toggleFilter("direction")),
                    class: vue.normalizeClass({ "active": $data.filters.direction })
                  },
                  " 方向▼ ",
                  2
                  /* CLASS */
                ),
                vue.createElementVNode(
                  "th",
                  {
                    onClick: _cache[3] || (_cache[3] = ($event) => $options.toggleFilter("device")),
                    class: vue.normalizeClass({ "active": $data.filters.device })
                  },
                  " 设备▼ ",
                  2
                  /* CLASS */
                ),
                vue.createElementVNode(
                  "th",
                  {
                    onClick: _cache[4] || (_cache[4] = ($event) => $options.toggleFilter("urgency")),
                    class: vue.normalizeClass({ "active": $data.filters.urgency })
                  },
                  " 紧急程度▼ ",
                  2
                  /* CLASS */
                )
              ])
            ]),
            vue.createElementVNode("tbody", null, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($options.filteredTimeCurveData, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock(
                    "tr",
                    {
                      key: index,
                      class: vue.normalizeClass({ "odd-row": index % 2 === 0 })
                    },
                    [
                      vue.createElementVNode(
                        "td",
                        null,
                        vue.toDisplayString($options.formatTime(item.time)),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "td",
                        null,
                        vue.toDisplayString(item.direction),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "td",
                        null,
                        vue.toDisplayString(item.device),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "td",
                        null,
                        vue.toDisplayString($options.formatUrgency(item.urgency)),
                        1
                        /* TEXT */
                      )
                    ],
                    2
                    /* CLASS */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      $data.activeType === "frequencySpectrum" ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 1,
        class: "table-wrapper"
      }, [
        vue.createElementVNode("div", { class: "table-container" }, [
          vue.createElementVNode("table", null, [
            vue.createElementVNode("thead", null, [
              vue.createElementVNode("tr", null, [
                vue.createElementVNode("th", {
                  onClick: _cache[5] || (_cache[5] = ($event) => $options.toggleFilter("time"))
                }, "时间"),
                vue.createElementVNode(
                  "th",
                  {
                    onClick: _cache[6] || (_cache[6] = ($event) => $options.toggleFilter("direction")),
                    class: vue.normalizeClass({ "active": $data.filters.direction })
                  },
                  " 方向▼ ",
                  2
                  /* CLASS */
                ),
                vue.createElementVNode(
                  "th",
                  {
                    onClick: _cache[7] || (_cache[7] = ($event) => $options.toggleFilter("device")),
                    class: vue.normalizeClass({ "active": $data.filters.device })
                  },
                  " 设备▼ ",
                  2
                  /* CLASS */
                ),
                vue.createElementVNode("th", {
                  onClick: _cache[8] || (_cache[8] = ($event) => $options.toggleFilter("frequency"))
                }, "频率区间"),
                vue.createElementVNode("th", {
                  onClick: _cache[9] || (_cache[9] = ($event) => $options.toggleFilter("data"))
                }, "数据"),
                vue.createElementVNode(
                  "th",
                  {
                    onClick: _cache[10] || (_cache[10] = ($event) => $options.toggleFilter("urgency")),
                    class: vue.normalizeClass({ "active": $data.filters.urgency })
                  },
                  " 紧急程度▼ ",
                  2
                  /* CLASS */
                )
              ])
            ]),
            vue.createElementVNode("tbody", null, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($options.filteredFrequencySpectrumData, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock(
                    "tr",
                    {
                      key: index,
                      class: vue.normalizeClass({ "odd-row": index % 2 === 0 })
                    },
                    [
                      vue.createElementVNode(
                        "td",
                        null,
                        vue.toDisplayString($options.formatTime(item.time)),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "td",
                        null,
                        vue.toDisplayString(item.direction),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "td",
                        null,
                        vue.toDisplayString(item.device),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "td",
                        null,
                        vue.toDisplayString(item.frequencyInterval),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "td",
                        null,
                        vue.toDisplayString(item.data),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "td",
                        null,
                        vue.toDisplayString($options.formatUrgency(item.urgency)),
                        1
                        /* TEXT */
                      )
                    ],
                    2
                    /* CLASS */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 方向选择框 "),
      $data.showDirectionFilter ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 2,
        class: "filter-popup"
      }, [
        vue.createVNode(_component_u_select, {
          modelValue: $data.showDirectionFilter,
          "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.showDirectionFilter = $event),
          list: $data.directionList,
          onConfirm: $options.confirmFilterDirection
        }, null, 8, ["modelValue", "list", "onConfirm"])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 设备选择框 "),
      $data.showDeviceFilter ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 3,
        class: "filter-popup"
      }, [
        vue.createVNode(_component_u_select, {
          modelValue: $data.showDeviceFilter,
          "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.showDeviceFilter = $event),
          list: $data.deviceSelectList,
          onConfirm: $options.confirmFilterDevice
        }, null, 8, ["modelValue", "list", "onConfirm"])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 紧急程度选择框 "),
      $data.showUrgencyFilter ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 4,
        class: "filter-popup"
      }, [
        vue.createVNode(_component_u_select, {
          modelValue: $data.showUrgencyFilter,
          "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $data.showUrgencyFilter = $event),
          list: $data.urgencyList,
          onConfirm: $options.confirmFilterUrgency
        }, null, 8, ["modelValue", "list", "onConfirm"])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAbnormalBuilding1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/pages/abnormal/Building1.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        activeType: "timeCurve",
        timeCurveData: [],
        frequencySpectrumData: [],
        filters: {
          startYear: null,
          startMonth: null,
          startDay: null,
          endYear: null,
          endMonth: null,
          endDay: null,
          direction: null,
          device: null,
          urgency: null
        },
        years: Array.from({ length: 50 }, (_2, i2) => (/* @__PURE__ */ new Date()).getFullYear() - i2),
        months: Array.from({ length: 12 }, (_2, i2) => i2 + 1),
        days: Array.from({ length: 31 }, (_2, i2) => i2 + 1),
        directionList: [{ label: "全部", value: null }, { label: "X", value: "X" }, { label: "Y", value: "Y" }, { label: "Z", value: "Z" }],
        deviceSelectList: [
          { label: "全部", value: null },
          { label: "E43AC643", value: "E43AC643" },
          { label: "29FA1867", value: "29FA1867" },
          { label: "87C3D4E4", value: "87C3D4E4" },
          { label: "9A0D1958", value: "9A0D1958" },
          { label: "F853ED49", value: "F853ED49" },
          { label: "A77C5238", value: "A77C5238" }
        ],
        urgencyList: [
          { label: "全部", value: null },
          { label: "低", value: 1 },
          { label: "中", value: 2 },
          { label: "高", value: 3 },
          { label: "极高", value: 4 }
        ],
        showDirectionFilter: false,
        showDeviceFilter: false,
        showUrgencyFilter: false
      };
    },
    computed: {
      filteredTimeCurveData() {
        return this.applyFilter(this.timeCurveData);
      },
      filteredFrequencySpectrumData() {
        return this.applyFilter(this.frequencySpectrumData);
      }
    },
    methods: {
      async fetchData() {
        try {
          const timeUrl = "http://110.42.214.164:8003/TimeAnomaly";
          const spectrumUrl = "http://110.42.214.164:8003/SpectrumAnomaly";
          const timeResponse = await uni.request({
            url: timeUrl,
            method: "GET",
            data: {}
          });
          const spectrumResponse = await uni.request({
            url: spectrumUrl,
            method: "GET",
            data: {}
          });
          const timeResult = timeResponse.data;
          const spectrumResult = spectrumResponse.data;
          if (timeResult.code === 200) {
            this.timeCurveData = timeResult.data;
          }
          if (spectrumResult.code === 200) {
            this.frequencySpectrumData = spectrumResult.data;
          }
        } catch (error2) {
          formatAppLog("error", "at pages/abnormal/Building2.vue:200", "获取数据失败：", error2);
        }
      },
      applyFilter(data) {
        return data.filter((item) => {
          const matchesDirection = !this.filters.direction || item.direction === this.filters.direction;
          const matchesDevice = !this.filters.device || item.device === this.filters.device;
          const matchesUrgency = !this.filters.urgency || item.urgency === this.filters.urgency;
          return matchesDirection && matchesDevice && matchesUrgency;
        });
      },
      formatTime(timestamp) {
        const date2 = new Date(timestamp);
        return `${date2.getFullYear()}-${(date2.getMonth() + 1).toString().padStart(2, "0")}-${date2.getDate().toString().padStart(2, "0")} ${date2.getHours().toString().padStart(2, "0")}:${date2.getMinutes().toString().padStart(2, "0")}`;
      },
      formatUrgency(level) {
        const levels = { 1: "低", 2: "中", 3: "高", 4: "极高" };
        return levels[level];
      },
      setActiveType(type) {
        this.activeType = type;
      },
      toggleFilter(column) {
        this.showDirectionFilter = false;
        this.showDeviceFilter = false;
        this.showUrgencyFilter = false;
        if (column === "direction") {
          this.showDirectionFilter = true;
        } else if (column === "device") {
          this.showDeviceFilter = true;
        } else if (column === "urgency") {
          this.showUrgencyFilter = true;
        }
      },
      confirmFilterDirection(selected) {
        this.filters.direction = selected[0].value;
      },
      confirmFilterDevice(selected) {
        this.filters.device = selected[0].value;
      },
      confirmFilterUrgency(selected) {
        this.filters.urgency = selected[0].value;
      }
    },
    mounted() {
      this.fetchData();
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_u_select = resolveEasycom(vue.resolveDynamicComponent("u-select"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("div", {
      id: "app",
      class: "container"
    }, [
      vue.createCommentVNode(" 曲线类型选择 "),
      vue.createElementVNode("div", { class: "type-selector" }, [
        vue.createElementVNode(
          "button",
          {
            class: vue.normalizeClass({ "active": $data.activeType === "timeCurve" }),
            onClick: _cache[0] || (_cache[0] = ($event) => $options.setActiveType("timeCurve"))
          },
          " 时程曲线 ",
          2
          /* CLASS */
        ),
        vue.createElementVNode(
          "button",
          {
            class: vue.normalizeClass({ "active": $data.activeType === "frequencySpectrum" }),
            onClick: _cache[1] || (_cache[1] = ($event) => $options.setActiveType("frequencySpectrum"))
          },
          " 频谱曲线 ",
          2
          /* CLASS */
        )
      ]),
      vue.createCommentVNode(" 异常数据表 "),
      $data.activeType === "timeCurve" ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: "table-wrapper"
      }, [
        vue.createElementVNode("div", { class: "table-container" }, [
          vue.createElementVNode("table", null, [
            vue.createElementVNode("thead", null, [
              vue.createElementVNode("tr", null, [
                vue.createElementVNode("th", null, "时间"),
                vue.createElementVNode(
                  "th",
                  {
                    onClick: _cache[2] || (_cache[2] = ($event) => $options.toggleFilter("direction")),
                    class: vue.normalizeClass({ "active": $data.filters.direction })
                  },
                  " 方向▼ ",
                  2
                  /* CLASS */
                ),
                vue.createElementVNode(
                  "th",
                  {
                    onClick: _cache[3] || (_cache[3] = ($event) => $options.toggleFilter("device")),
                    class: vue.normalizeClass({ "active": $data.filters.device })
                  },
                  " 设备▼ ",
                  2
                  /* CLASS */
                ),
                vue.createElementVNode(
                  "th",
                  {
                    onClick: _cache[4] || (_cache[4] = ($event) => $options.toggleFilter("urgency")),
                    class: vue.normalizeClass({ "active": $data.filters.urgency })
                  },
                  " 紧急程度▼ ",
                  2
                  /* CLASS */
                )
              ])
            ]),
            vue.createElementVNode("tbody", null, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($options.filteredTimeCurveData, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock(
                    "tr",
                    {
                      key: index,
                      class: vue.normalizeClass({ "odd-row": index % 2 === 0 })
                    },
                    [
                      vue.createElementVNode(
                        "td",
                        null,
                        vue.toDisplayString($options.formatTime(item.time)),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "td",
                        null,
                        vue.toDisplayString(item.direction),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "td",
                        null,
                        vue.toDisplayString(item.device),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "td",
                        null,
                        vue.toDisplayString($options.formatUrgency(item.urgency)),
                        1
                        /* TEXT */
                      )
                    ],
                    2
                    /* CLASS */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      $data.activeType === "frequencySpectrum" ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 1,
        class: "table-wrapper"
      }, [
        vue.createElementVNode("div", { class: "table-container" }, [
          vue.createElementVNode("table", null, [
            vue.createElementVNode("thead", null, [
              vue.createElementVNode("tr", null, [
                vue.createElementVNode("th", null, "时间"),
                vue.createElementVNode(
                  "th",
                  {
                    onClick: _cache[5] || (_cache[5] = ($event) => $options.toggleFilter("direction")),
                    class: vue.normalizeClass({ "active": $data.filters.direction })
                  },
                  " 方向▼ ",
                  2
                  /* CLASS */
                ),
                vue.createElementVNode(
                  "th",
                  {
                    onClick: _cache[6] || (_cache[6] = ($event) => $options.toggleFilter("device")),
                    class: vue.normalizeClass({ "active": $data.filters.device })
                  },
                  " 设备▼ ",
                  2
                  /* CLASS */
                ),
                vue.createElementVNode("th", {
                  onClick: _cache[7] || (_cache[7] = ($event) => $options.toggleFilter("frequency"))
                }, "频率区间"),
                vue.createElementVNode("th", {
                  onClick: _cache[8] || (_cache[8] = ($event) => $options.toggleFilter("data"))
                }, "数据"),
                vue.createElementVNode(
                  "th",
                  {
                    onClick: _cache[9] || (_cache[9] = ($event) => $options.toggleFilter("urgency")),
                    class: vue.normalizeClass({ "active": $data.filters.urgency })
                  },
                  " 紧急程度▼ ",
                  2
                  /* CLASS */
                )
              ])
            ]),
            vue.createElementVNode("tbody", null, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($options.filteredFrequencySpectrumData, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock(
                    "tr",
                    {
                      key: index,
                      class: vue.normalizeClass({ "odd-row": index % 2 === 0 })
                    },
                    [
                      vue.createElementVNode(
                        "td",
                        null,
                        vue.toDisplayString($options.formatTime(item.time)),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "td",
                        null,
                        vue.toDisplayString(item.direction),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "td",
                        null,
                        vue.toDisplayString(item.device),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "td",
                        null,
                        vue.toDisplayString(item.frequencyInterval),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "td",
                        null,
                        vue.toDisplayString(item.data),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "td",
                        null,
                        vue.toDisplayString($options.formatUrgency(item.urgency)),
                        1
                        /* TEXT */
                      )
                    ],
                    2
                    /* CLASS */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 方向选择框 "),
      $data.showDirectionFilter ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 2,
        class: "filter-popup"
      }, [
        vue.createVNode(_component_u_select, {
          modelValue: $data.showDirectionFilter,
          "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.showDirectionFilter = $event),
          list: $data.directionList,
          onConfirm: $options.confirmFilterDirection
        }, null, 8, ["modelValue", "list", "onConfirm"])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 设备选择框 "),
      $data.showDeviceFilter ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 3,
        class: "filter-popup"
      }, [
        vue.createVNode(_component_u_select, {
          modelValue: $data.showDeviceFilter,
          "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $data.showDeviceFilter = $event),
          list: $data.deviceSelectList,
          onConfirm: $options.confirmFilterDevice
        }, null, 8, ["modelValue", "list", "onConfirm"])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 紧急程度选择框 "),
      $data.showUrgencyFilter ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 4,
        class: "filter-popup"
      }, [
        vue.createVNode(_component_u_select, {
          modelValue: $data.showUrgencyFilter,
          "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $data.showUrgencyFilter = $event),
          list: $data.urgencyList,
          onConfirm: $options.confirmFilterUrgency
        }, null, 8, ["modelValue", "list", "onConfirm"])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAbnormalBuilding2 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/pages/abnormal/Building2.vue"]]);
  __definePage("pages/index/Login", PagesIndexLogin);
  __definePage("pages/index/SelectBuilding", PagesIndexSelectBuilding);
  __definePage("pages/index/Building1", PagesIndexBuilding1);
  __definePage("pages/index/Building2", PagesIndexBuilding2);
  __definePage("pages/index/SensorDetail8", PagesIndexSensorDetail8);
  __definePage("pages/index/SensorDetail9", PagesIndexSensorDetail9);
  __definePage("pages/index/SensorDetail10", PagesIndexSensorDetail10);
  __definePage("pages/index/Guide", PagesIndexGuide);
  __definePage("pages/abnormal/AbnormalGuide", PagesAbnormalAbnormalGuide);
  __definePage("pages/abnormal/Building1", PagesAbnormalBuilding1);
  __definePage("pages/abnormal/Building2", PagesAbnormalBuilding2);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "E:/VS Code Files/Project/CurtainWallMobile-Frontend/App.vue"]]);
  const mixin = {
    data() {
      return {};
    },
    onLoad() {
      this.$u.getRect = this.$uGetRect;
    },
    methods: {
      // 查询节点信息
      // 目前此方法在支付宝小程序中无法获取组件跟接点的尺寸，为支付宝的bug(2020-07-21)
      // 解决办法为在组件根部再套一个没有任何作用的view元素
      $uGetRect(selector, all) {
        return new Promise((resolve) => {
          uni.createSelectorQuery().in(this)[all ? "selectAll" : "select"](selector).boundingClientRect((rect) => {
            if (all && Array.isArray(rect) && rect.length) {
              resolve(rect);
            }
            if (!all && rect) {
              resolve(rect);
            }
          }).exec();
        });
      },
      getParentData(parentName = "") {
        if (!this.parent)
          this.parent = false;
        this.parent = this.$u.$parent.call(this, parentName);
        if (this.parent) {
          Object.keys(this.parentData).map((key) => {
            this.parentData[key] = this.parent[key];
          });
          this.parentData.value = this.parent.modelValue;
        }
      },
      // 阻止事件冒泡
      preventEvent(e2) {
        e2 && e2.stopPropagation && e2.stopPropagation();
      }
    },
    onReachBottom() {
      uni.$emit("uOnReachBottom");
    },
    beforeUnmount() {
      if (this.parent && uni.$u.test.array(this.parent.children)) {
        const childrenList = this.parent.children;
        childrenList.map((child, index) => {
          if (child === this) {
            childrenList.splice(index, 1);
          }
        });
      }
    }
  };
  function isArray(arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
  }
  function deepClone(obj) {
    if ([null, void 0, NaN, false].includes(obj))
      return obj;
    if (typeof obj !== "object" && typeof obj !== "function") {
      return obj;
    }
    var o2 = isArray(obj) ? [] : {};
    for (let i2 in obj) {
      if (obj.hasOwnProperty(i2)) {
        o2[i2] = typeof obj[i2] === "object" ? deepClone(obj[i2]) : obj[i2];
      }
    }
    return o2;
  }
  function deepMerge(target = {}, source = {}) {
    target = deepClone(target);
    if (typeof target !== "object" || typeof source !== "object")
      return false;
    for (var prop in source) {
      if (!source.hasOwnProperty(prop))
        continue;
      if (prop in target) {
        if (typeof target[prop] !== "object") {
          target[prop] = source[prop];
        } else {
          if (typeof source[prop] !== "object") {
            target[prop] = source[prop];
          } else {
            if (target[prop].concat && source[prop].concat) {
              target[prop] = target[prop].concat(source[prop]);
            } else {
              target[prop] = deepMerge(target[prop], source[prop]);
            }
          }
        }
      } else {
        target[prop] = source[prop];
      }
    }
    return target;
  }
  function email(value) {
    return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value);
  }
  function mobile(value) {
    return /^1[23456789]\d{9}$/.test(value);
  }
  function url(value) {
    return /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-.\/?%&=]*)?/.test(value);
  }
  function date(value) {
    if (!value)
      return false;
    if (number(value))
      value = +value;
    return !/Invalid|NaN/.test(new Date(value).toString());
  }
  function dateISO(value) {
    return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
  }
  function number(value) {
    return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
  }
  function digits(value) {
    return /^\d+$/.test(value);
  }
  function idCard(value) {
    return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(
      value
    );
  }
  function carNo(value) {
    const xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
    const creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
    if (value.length === 7) {
      return creg.test(value);
    } else if (value.length === 8) {
      return xreg.test(value);
    } else {
      return false;
    }
  }
  function amount(value) {
    return /^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2}$/.test(value);
  }
  function chinese(value) {
    let reg = /^[\u4e00-\u9fa5]+$/gi;
    return reg.test(value);
  }
  function letter(value) {
    return /^[a-zA-Z]*$/.test(value);
  }
  function enOrNum(value) {
    let reg = /^[0-9a-zA-Z]*$/g;
    return reg.test(value);
  }
  function contains(value, param) {
    return value.indexOf(param) >= 0;
  }
  function range(value, param) {
    return value >= param[0] && value <= param[1];
  }
  function rangeLength(value, param) {
    return value.length >= param[0] && value.length <= param[1];
  }
  function landline(value) {
    let reg = /^\d{3,4}-\d{7,8}(-\d{3,4})?$/;
    return reg.test(value);
  }
  function empty(value) {
    switch (typeof value) {
      case "undefined":
        return true;
      case "string":
        if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, "").length == 0)
          return true;
        break;
      case "boolean":
        if (!value)
          return true;
        break;
      case "number":
        if (0 === value || isNaN(value))
          return true;
        break;
      case "object":
        if (null === value || value.length === 0)
          return true;
        for (var i2 in value) {
          return false;
        }
        return true;
    }
    return false;
  }
  function jsonString(value) {
    if (typeof value == "string") {
      try {
        var obj = JSON.parse(value);
        if (typeof obj == "object" && obj) {
          return true;
        } else {
          return false;
        }
      } catch (e2) {
        return false;
      }
    }
    return false;
  }
  function array(value) {
    if (typeof Array.isArray === "function") {
      return Array.isArray(value);
    } else {
      return Object.prototype.toString.call(value) === "[object Array]";
    }
  }
  function object(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
  }
  function code(value, len = 6) {
    return new RegExp(`^\\d{${len}}$`).test(value);
  }
  function func(value) {
    return typeof value === "function";
  }
  function promise(value) {
    return object(value) && func(value.then) && func(value.catch);
  }
  function image(value) {
    const newValue = value.split("?")[0];
    return new RegExp(/\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)$/).test(newValue);
  }
  function video(value) {
    const newValue = value.split("?")[0];
    return new RegExp(/\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv|m3u8|3gp)$/).test(newValue);
  }
  function regExp(o2) {
    return o2 && Object.prototype.toString.call(o2) === "[object RegExp]";
  }
  function string(value) {
    return typeof value === "string";
  }
  const test = {
    email,
    mobile,
    url,
    date,
    dateISO,
    number,
    digits,
    idCard,
    carNo,
    amount,
    chinese,
    letter,
    enOrNum,
    contains,
    range,
    rangeLength,
    empty,
    isEmpty: empty,
    jsonString,
    landline,
    object,
    array,
    code,
    func,
    promise,
    video,
    image,
    regExp,
    string
  };
  class Request {
    // 设置全局默认配置
    setConfig(customConfig) {
      this.config = deepMerge(this.config, customConfig);
    }
    // 主要请求部分
    request(options = {}) {
      if (this.interceptor.request && typeof this.interceptor.request === "function") {
        let interceptorRequest = this.interceptor.request(options);
        if (interceptorRequest === false) {
          return new Promise(() => {
          });
        }
        this.options = interceptorRequest;
      }
      options.dataType = options.dataType || this.config.dataType;
      options.responseType = options.responseType || this.config.responseType;
      options.url = options.url || "";
      options.params = options.params || {};
      options.header = Object.assign({}, this.config.header, options.header);
      options.method = options.method || this.config.method;
      return new Promise((resolve, reject) => {
        options.complete = (response) => {
          uni.hideLoading();
          clearTimeout(this.config.timer);
          this.config.timer = null;
          if (this.config.originalData) {
            if (this.interceptor.response && typeof this.interceptor.response === "function") {
              let resInterceptors = this.interceptor.response(response);
              if (resInterceptors !== false) {
                resolve(resInterceptors);
              } else {
                reject(response);
              }
            } else {
              resolve(response);
            }
          } else {
            if (response.statusCode == 200) {
              if (this.interceptor.response && typeof this.interceptor.response === "function") {
                let resInterceptors = this.interceptor.response(response.data);
                if (resInterceptors !== false) {
                  resolve(resInterceptors);
                } else {
                  reject(response.data);
                }
              } else {
                resolve(response.data);
              }
            } else {
              reject(response);
            }
          }
        };
        options.url = test.url(options.url) ? options.url : this.config.baseUrl + (options.url.indexOf("/") == 0 ? options.url : "/" + options.url);
        if (this.config.showLoading && !this.config.timer) {
          this.config.timer = setTimeout(() => {
            uni.showLoading({
              title: this.config.loadingText,
              mask: this.config.loadingMask
            });
            this.config.timer = null;
          }, this.config.loadingTime);
        }
        uni.request(options);
      });
    }
    constructor() {
      this.config = {
        baseUrl: "",
        // 请求的根域名
        // 默认的请求头
        header: {},
        method: "POST",
        // 设置为json，返回后uni.request会对数据进行一次JSON.parse
        dataType: "json",
        // 此参数无需处理，因为5+和支付宝小程序不支持，默认为text即可
        responseType: "text",
        showLoading: true,
        // 是否显示请求中的loading
        loadingText: "请求中...",
        loadingTime: 800,
        // 在此时间内，请求还没回来的话，就显示加载中动画，单位ms
        timer: null,
        // 定时器
        originalData: false,
        // 是否在拦截器中返回服务端的原始数据，见文档说明
        loadingMask: true
        // 展示loading的时候，是否给一个透明的蒙层，防止触摸穿透
      };
      this.interceptor = {
        // 请求前的拦截
        request: null,
        // 请求后的拦截
        response: null
      };
      this.get = (url2, data = {}, header = {}) => {
        return this.request({
          method: "GET",
          url: url2,
          header,
          data
        });
      };
      this.post = (url2, data = {}, header = {}) => {
        return this.request({
          url: url2,
          method: "POST",
          header,
          data
        });
      };
      this.put = (url2, data = {}, header = {}) => {
        return this.request({
          url: url2,
          method: "PUT",
          header,
          data
        });
      };
      this.delete = (url2, data = {}, header = {}) => {
        return this.request({
          url: url2,
          method: "DELETE",
          header,
          data
        });
      };
    }
  }
  const http = new Request();
  function queryParams(data = {}, isPrefix = true, arrayFormat = "brackets") {
    let prefix = isPrefix ? "?" : "";
    let _result = [];
    if (["indices", "brackets", "repeat", "comma"].indexOf(arrayFormat) == -1)
      arrayFormat = "brackets";
    for (let key in data) {
      let value = data[key];
      if (["", void 0, null].indexOf(value) >= 0) {
        continue;
      }
      if (value.constructor === Array) {
        switch (arrayFormat) {
          case "indices":
            for (let i2 = 0; i2 < value.length; i2++) {
              _result.push(key + "[" + i2 + "]=" + value[i2]);
            }
            break;
          case "brackets":
            value.forEach((_value) => {
              _result.push(key + "[]=" + _value);
            });
            break;
          case "repeat":
            value.forEach((_value) => {
              _result.push(key + "=" + _value);
            });
            break;
          case "comma":
            let commaStr = "";
            value.forEach((_value) => {
              commaStr += (commaStr ? "," : "") + _value;
            });
            _result.push(key + "=" + commaStr);
            break;
          default:
            value.forEach((_value) => {
              _result.push(key + "[]=" + _value);
            });
        }
      } else {
        _result.push(key + "=" + value);
      }
    }
    return _result.length ? prefix + _result.join("&") : "";
  }
  class Router {
    constructor() {
      this.config = {
        type: "navigateTo",
        url: "",
        delta: 1,
        // navigateBack页面后退时,回退的层数
        params: {},
        // 传递的参数
        animationType: "pop-in",
        // 窗口动画,只在APP有效
        animationDuration: 300,
        // 窗口动画持续时间,单位毫秒,只在APP有效
        intercept: false
        // 是否需要拦截
      };
      this.route = this.route.bind(this);
    }
    // 判断url前面是否有"/"，如果没有则加上，否则无法跳转
    addRootPath(url2) {
      return url2[0] === "/" ? url2 : `/${url2}`;
    }
    // 整合路由参数
    mixinParam(url2, params) {
      url2 = url2 && this.addRootPath(url2);
      let query = "";
      if (/.*\/.*\?.*=.*/.test(url2)) {
        query = uni.$u.queryParams(params, false);
        return url2 += "&" + query;
      } else {
        query = uni.$u.queryParams(params);
        return url2 += query;
      }
    }
    // 对外的方法名称
    async route(options = {}, params = {}) {
      let mergeConfig = {};
      if (typeof options === "string") {
        mergeConfig.url = this.mixinParam(options, params);
        mergeConfig.type = "navigateTo";
      } else {
        mergeConfig = uni.$u.deepClone(options, this.config);
        mergeConfig.url = this.mixinParam(options.url, options.params);
      }
      if (params.intercept) {
        this.config.intercept = params.intercept;
      }
      mergeConfig.params = params;
      mergeConfig = uni.$u.deepMerge(this.config, mergeConfig);
      if (typeof uni.$u.routeIntercept === "function") {
        const isNext = await new Promise((resolve, reject) => {
          uni.$u.routeIntercept(mergeConfig, resolve);
        });
        isNext && this.openPage(mergeConfig);
      } else {
        this.openPage(mergeConfig);
      }
    }
    // 执行路由跳转
    openPage(config2) {
      const {
        url: url2,
        type,
        delta,
        animationType,
        animationDuration
      } = config2;
      if (config2.type == "navigateTo" || config2.type == "to") {
        uni.navigateTo({
          url: url2,
          animationType,
          animationDuration
        });
      }
      if (config2.type == "redirectTo" || config2.type == "redirect") {
        uni.redirectTo({
          url: url2
        });
      }
      if (config2.type == "switchTab" || config2.type == "tab") {
        uni.switchTab({
          url: url2
        });
      }
      if (config2.type == "reLaunch" || config2.type == "launch") {
        uni.reLaunch({
          url: url2
        });
      }
      if (config2.type == "navigateBack" || config2.type == "back") {
        uni.navigateBack({
          delta
        });
      }
    }
  }
  const route = new Router().route;
  if (!String.prototype.padStart) {
    String.prototype.padStart = function(maxLength, fillString = " ") {
      if (Object.prototype.toString.call(fillString) !== "[object String]")
        throw new TypeError(
          "fillString must be String"
        );
      let str = this;
      if (str.length >= maxLength)
        return String(str);
      let fillLength = maxLength - str.length, times = Math.ceil(fillLength / fillString.length);
      while (times >>= 1) {
        fillString += fillString;
        if (times === 1) {
          fillString += fillString;
        }
      }
      return fillString.slice(0, fillLength) + str;
    };
  }
  function timeFormat(dateTime = null, fmt = "yyyy-mm-dd") {
    if (!dateTime)
      dateTime = Number(/* @__PURE__ */ new Date());
    if (dateTime.toString().length == 10)
      dateTime *= 1e3;
    let date2 = new Date(dateTime);
    let ret;
    let opt = {
      "y+": date2.getFullYear().toString(),
      // 年
      "m+": (date2.getMonth() + 1).toString(),
      // 月
      "d+": date2.getDate().toString(),
      // 日
      "h+": date2.getHours().toString(),
      // 时
      "M+": date2.getMinutes().toString(),
      // 分
      "s+": date2.getSeconds().toString()
      // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
        fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0"));
      }
    }
    return fmt;
  }
  function timeFrom(dateTime = null, format = "yyyy-mm-dd") {
    if (!dateTime)
      dateTime = Number(/* @__PURE__ */ new Date());
    if (dateTime.toString().length == 10)
      dateTime *= 1e3;
    let timestamp = +new Date(Number(dateTime));
    let timer = (Number(/* @__PURE__ */ new Date()) - timestamp) / 1e3;
    let tips = "";
    switch (true) {
      case timer < 300:
        tips = "刚刚";
        break;
      case (timer >= 300 && timer < 3600):
        tips = parseInt(timer / 60) + "分钟前";
        break;
      case (timer >= 3600 && timer < 86400):
        tips = parseInt(timer / 3600) + "小时前";
        break;
      case (timer >= 86400 && timer < 2592e3):
        tips = parseInt(timer / 86400) + "天前";
        break;
      default:
        if (format === false) {
          if (timer >= 2592e3 && timer < 365 * 86400) {
            tips = parseInt(timer / (86400 * 30)) + "个月前";
          } else {
            tips = parseInt(timer / (86400 * 365)) + "年前";
          }
        } else {
          tips = timeFormat(timestamp, format);
        }
    }
    return tips;
  }
  function colorGradient(startColor = "rgb(0, 0, 0)", endColor = "rgb(255, 255, 255)", step = 10) {
    let startRGB = hexToRgb(startColor, false);
    let startR = startRGB[0];
    let startG = startRGB[1];
    let startB = startRGB[2];
    let endRGB = hexToRgb(endColor, false);
    let endR = endRGB[0];
    let endG = endRGB[1];
    let endB = endRGB[2];
    let sR = (endR - startR) / step;
    let sG = (endG - startG) / step;
    let sB = (endB - startB) / step;
    let colorArr = [];
    for (let i2 = 0; i2 < step; i2++) {
      let hex = rgbToHex("rgb(" + Math.round(sR * i2 + startR) + "," + Math.round(sG * i2 + startG) + "," + Math.round(sB * i2 + startB) + ")");
      colorArr.push(hex);
    }
    return colorArr;
  }
  function hexToRgb(sColor, str = true) {
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    sColor = sColor.toLowerCase();
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        let sColorNew = "#";
        for (let i2 = 1; i2 < 4; i2 += 1) {
          sColorNew += sColor.slice(i2, i2 + 1).concat(sColor.slice(i2, i2 + 1));
        }
        sColor = sColorNew;
      }
      let sColorChange = [];
      for (let i2 = 1; i2 < 7; i2 += 2) {
        sColorChange.push(parseInt("0x" + sColor.slice(i2, i2 + 2)));
      }
      if (!str) {
        return sColorChange;
      } else {
        return `rgb(${sColorChange[0]},${sColorChange[1]},${sColorChange[2]})`;
      }
    } else if (/^(rgb|RGB)/.test(sColor)) {
      let arr = sColor.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
      return arr.map((val) => Number(val));
    } else {
      return sColor;
    }
  }
  function rgbToHex(rgb) {
    let _this = rgb;
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (/^(rgb|RGB)/.test(_this)) {
      let aColor = _this.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
      let strHex = "#";
      for (let i2 = 0; i2 < aColor.length; i2++) {
        let hex = Number(aColor[i2]).toString(16);
        hex = String(hex).length == 1 ? "0" + hex : hex;
        if (hex === "0") {
          hex += hex;
        }
        strHex += hex;
      }
      if (strHex.length !== 7) {
        strHex = _this;
      }
      return strHex;
    } else if (reg.test(_this)) {
      let aNum = _this.replace(/#/, "").split("");
      if (aNum.length === 6) {
        return _this;
      } else if (aNum.length === 3) {
        let numHex = "#";
        for (let i2 = 0; i2 < aNum.length; i2 += 1) {
          numHex += aNum[i2] + aNum[i2];
        }
        return numHex;
      }
    } else {
      return _this;
    }
  }
  function colorToRgba(color2, alpha = 0.3) {
    color2 = rgbToHex(color2);
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    let sColor = color2.toLowerCase();
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        var sColorNew = "#";
        for (let i2 = 1; i2 < 4; i2 += 1) {
          sColorNew += sColor.slice(i2, i2 + 1).concat(sColor.slice(i2, i2 + 1));
        }
        sColor = sColorNew;
      }
      var sColorChange = [];
      for (let i2 = 1; i2 < 7; i2 += 2) {
        sColorChange.push(parseInt("0x" + sColor.slice(i2, i2 + 2)));
      }
      return "rgba(" + sColorChange.join(",") + "," + alpha + ")";
    } else {
      return sColor;
    }
  }
  const colorGradient$1 = {
    colorGradient,
    hexToRgb,
    rgbToHex,
    colorToRgba
  };
  function guid(len = 32, firstU = true, radix = null) {
    let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
    let uuid = [];
    radix = radix || chars.length;
    if (len) {
      for (let i2 = 0; i2 < len; i2++)
        uuid[i2] = chars[0 | Math.random() * radix];
    } else {
      let r2;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
      uuid[14] = "4";
      for (let i2 = 0; i2 < 36; i2++) {
        if (!uuid[i2]) {
          r2 = 0 | Math.random() * 16;
          uuid[i2] = chars[i2 == 19 ? r2 & 3 | 8 : r2];
        }
      }
    }
    if (firstU) {
      uuid.shift();
      return "u" + uuid.join("");
    } else {
      return uuid.join("");
    }
  }
  let color = {
    primary: "#2979ff",
    primaryDark: "#2b85e4",
    primaryDisabled: "#a0cfff",
    primaryLight: "#ecf5ff",
    bgColor: "#f3f4f6",
    info: "#909399",
    infoDark: "#82848a",
    infoDisabled: "#c8c9cc",
    infoLight: "#f4f4f5",
    warning: "#ff9900",
    warningDark: "#f29100",
    warningDisabled: "#fcbd71",
    warningLight: "#fdf6ec",
    error: "#fa3534",
    errorDark: "#dd6161",
    errorDisabled: "#fab6b6",
    errorLight: "#fef0f0",
    success: "#19be6b",
    successDark: "#18b566",
    successDisabled: "#71d5a1",
    successLight: "#dbf1e1",
    mainColor: "#303133",
    contentColor: "#606266",
    tipsColor: "#909399",
    lightColor: "#c0c4cc",
    borderColor: "#e4e7ed"
  };
  function type2icon(type = "success", fill = false) {
    if (["primary", "info", "error", "warning", "success"].indexOf(type) == -1)
      type = "success";
    let iconName = "";
    switch (type) {
      case "primary":
        iconName = "info-circle";
        break;
      case "info":
        iconName = "info-circle";
        break;
      case "error":
        iconName = "close-circle";
        break;
      case "warning":
        iconName = "error-circle";
        break;
      case "success":
        iconName = "checkmark-circle";
        break;
      default:
        iconName = "checkmark-circle";
    }
    if (fill)
      iconName += "-fill";
    return iconName;
  }
  function randomArray(array2 = []) {
    return array2.sort(() => Math.random() - 0.5);
  }
  const addUnit = function(value = "auto", unit = "rpx") {
    value = String(value);
    return test.number(value) ? `${value}${unit}` : value;
  };
  function random(min, max) {
    if (min >= 0 && max > 0 && max >= min) {
      let gab = max - min + 1;
      return Math.floor(Math.random() * gab + min);
    } else {
      return 0;
    }
  }
  function trim$1(str, pos = "both") {
    if (pos == "both") {
      return str.replace(/^\s+|\s+$/g, "");
    } else if (pos == "left") {
      return str.replace(/^\s*/, "");
    } else if (pos == "right") {
      return str.replace(/(\s*$)/g, "");
    } else if (pos == "all") {
      return str.replace(/\s+/g, "");
    } else {
      return str;
    }
  }
  function toast(title, duration = 1500) {
    uni.showToast({
      title,
      icon: "none",
      duration
    });
  }
  function getParent(name, keys) {
    let parent = this.$parent;
    while (parent) {
      if (parent.$options.name !== name) {
        parent = parent.$parent;
      } else {
        let data = {};
        if (Array.isArray(keys)) {
          keys.map((val) => {
            data[val] = parent[val] ? parent[val] : "";
          });
        } else {
          for (let i2 in keys) {
            if (Array.isArray(keys[i2])) {
              if (keys[i2].length) {
                data[i2] = keys[i2];
              } else {
                data[i2] = parent[i2];
              }
            } else if (keys[i2].constructor === Object) {
              if (Object.keys(keys[i2]).length) {
                data[i2] = keys[i2];
              } else {
                data[i2] = parent[i2];
              }
            } else {
              data[i2] = keys[i2] || keys[i2] === false ? keys[i2] : parent[i2];
            }
          }
        }
        return data;
      }
    }
    return {};
  }
  function $parent(name = void 0) {
    let parent = this.$parent;
    while (parent) {
      if (parent.$options && parent.$options.name !== name) {
        parent = parent.$parent;
      } else {
        return parent;
      }
    }
    return false;
  }
  function os() {
    return uni.getSystemInfoSync().platform;
  }
  function sys() {
    return uni.getSystemInfoSync();
  }
  let timeout = null;
  function debounce(func2, wait = 500, immediate = false) {
    if (timeout !== null)
      clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(function() {
        timeout = null;
      }, wait);
      if (callNow)
        typeof func2 === "function" && func2();
    } else {
      timeout = setTimeout(function() {
        typeof func2 === "function" && func2();
      }, wait);
    }
  }
  let timeoutArr = [];
  let flagArr = [];
  function throttle(fn, time = 500, isImmediate = true, timeoutName = "default") {
    if (!timeoutArr[timeoutName])
      timeoutArr[timeoutName] = null;
    if (isImmediate) {
      if (!flagArr[timeoutName]) {
        flagArr[timeoutName] = true;
        if (typeof fn === "function")
          fn();
        timeoutArr[timeoutName] = setTimeout(() => {
          flagArr[timeoutName] = false;
        }, time);
      }
    } else {
      if (!flagArr[timeoutName]) {
        flagArr[timeoutName] = true;
        timeoutArr[timeoutName] = setTimeout(() => {
          flagArr[timeoutName] = false;
          if (typeof fn === "function")
            fn();
        }, time);
      }
    }
  }
  function trim(str, pos = "both") {
    str = String(str);
    if (pos == "both") {
      return str.replace(/^\s+|\s+$/g, "");
    }
    if (pos == "left") {
      return str.replace(/^\s*/, "");
    }
    if (pos == "right") {
      return str.replace(/(\s*$)/g, "");
    }
    if (pos == "all") {
      return str.replace(/\s+/g, "");
    }
    return str;
  }
  function addStyle(customStyle, target = "object") {
    if (test.empty(customStyle) || typeof customStyle === "object" && target === "object" || target === "string" && typeof customStyle === "string") {
      return customStyle;
    }
    if (target === "object") {
      customStyle = trim(customStyle);
      const styleArray = customStyle.split(";");
      const style = {};
      for (let i2 = 0; i2 < styleArray.length; i2++) {
        if (styleArray[i2]) {
          const item = styleArray[i2].split(":");
          style[trim(item[0])] = trim(item[1]);
        }
      }
      return style;
    }
    let string2 = "";
    for (const i2 in customStyle) {
      const key = i2.replace(/([A-Z])/g, "-$1").toLowerCase();
      string2 += `${key}:${customStyle[i2]};`;
    }
    return trim(string2);
  }
  let version = "1.10.1";
  const config = {
    v: version,
    version,
    // 主题名称
    type: [
      "primary",
      "success",
      "info",
      "error",
      "warning"
    ]
  };
  const zIndex = {
    toast: 10090,
    noNetwork: 10080,
    // popup包含popup，actionsheet，keyboard，picker的值
    popup: 10075,
    mask: 10070,
    navbar: 980,
    topTips: 975,
    sticky: 970,
    indexListSticky: 965
  };
  function wranning(str) {
    {
      formatAppLog("warn", "at uni_modules/vk-uview-ui/index.js:26", str);
    }
  }
  const $u = {
    queryParams,
    route,
    timeFormat,
    date: timeFormat,
    // 另名date
    timeFrom,
    colorGradient: colorGradient$1.colorGradient,
    colorToRgba: colorGradient$1.colorToRgba,
    guid,
    color,
    sys,
    os,
    type2icon,
    randomArray,
    wranning,
    get: http.get,
    post: http.post,
    put: http.put,
    "delete": http.delete,
    hexToRgb: colorGradient$1.hexToRgb,
    rgbToHex: colorGradient$1.rgbToHex,
    test,
    random,
    deepClone,
    deepMerge,
    getParent,
    $parent,
    addUnit,
    trim: trim$1,
    type: ["primary", "success", "error", "warning", "info"],
    http,
    toast,
    config,
    // uView配置信息相关，比如版本号
    zIndex,
    debounce,
    throttle,
    addStyle
  };
  uni.$u = $u;
  const install = (Vue2) => {
    Vue2.mixin(mixin);
    Vue2.config.globalProperties.$u = $u;
  };
  const uView = {
    install
  };
  function createApp() {
    const app = vue.createVueApp(App);
    app.use(uView);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
